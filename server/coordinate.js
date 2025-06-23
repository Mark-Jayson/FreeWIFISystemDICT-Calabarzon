const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'your_username',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'your_database',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

const MAPBOX_ACCESS_TOKEN = process.env.VITE_MAPBOX_ACCESS_TOKEN;

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

// Function to geocode location using Mapbox
async function geocodeLocation(locationName, locality, province) {
  try {
    // Construct search query
    const query = [locationName, locality, province].filter(Boolean).join(', ');
    
    const response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(query) + '.json', {
      params: {
        access_token: MAPBOX_ACCESS_TOKEN,
        country: 'PH', // Philippines country code
        limit: 1
      }
    });

    if (response.data.features && response.data.features.length > 0) {
      const coordinates = response.data.features[0].center;
      return {
        longitude: coordinates[0],
        latitude: coordinates[1]
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
}

// Endpoint to update coordinates
app.post('/api/update-coordinates', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { batchSize = 10 } = req.body;
    
    // Get all locations from the database
    const result = await client.query(`
      SELECT loc_id, location_name, locality, province, latitude, longitude 
      FROM location_export 
      ORDER BY loc_id
    `);
    
    const locations = result.rows;
    const updates = [];
    const errors = [];
    
    console.log(`Processing ${locations.length} locations...`);
    
    // Process locations in batches to avoid rate limiting
    for (let i = 0; i < locations.length; i += batchSize) {
      const batch = locations.slice(i, i + batchSize);
      
      for (const location of batch) {
        try {
          const { loc_id, location_name, locality, province, latitude, longitude } = location;
          
          // Skip if no location name
          if (!location_name) {
            continue;
          }
          
          // Get coordinates from Mapbox
          const mapboxCoords = await geocodeLocation(location_name, locality, province);
          
          if (!mapboxCoords) {
            errors.push({
              loc_id,
              location_name,
              error: 'No coordinates found from Mapbox'
            });
            continue;
          }
          
          let shouldUpdate = false;
          let reason = '';
          
          // Check if current coordinates are blank/null
          if (!latitude || !longitude || latitude === 0 || longitude === 0) {
            shouldUpdate = true;
            reason = 'Missing coordinates';
          } else {
            // Calculate distance between current and Mapbox coordinates
            const distance = calculateDistance(
              parseFloat(latitude), 
              parseFloat(longitude), 
              mapboxCoords.latitude, 
              mapboxCoords.longitude
            );
            
            if (distance > 5) {
              shouldUpdate = true;
              reason = `Distance: ${distance.toFixed(2)}km`;
            }
          }
          
          if (shouldUpdate) {
            // Update coordinates in database
            await client.query(`
              UPDATE location_export 
              SET latitude = $1, longitude = $2 
              WHERE loc_id = $3
            `, [mapboxCoords.latitude, mapboxCoords.longitude, loc_id]);
            
            updates.push({
              loc_id,
              location_name,
              old_coords: { latitude, longitude },
              new_coords: mapboxCoords,
              reason
            });
            
            console.log(`Updated ${location_name} (ID: ${loc_id}) - ${reason}`);
          }
          
        } catch (error) {
          errors.push({
            loc_id: location.loc_id,
            location_name: location.location_name,
            error: error.message
          });
        }
      }
      
      // Small delay between batches to respect rate limits
      if (i + batchSize < locations.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    res.json({
      success: true,
      total_processed: locations.length,
      updates_made: updates.length,
      errors_count: errors.length,
      updates,
      errors
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    client.release();
  }
});

// Endpoint to get update status
app.get('/api/coordinate-status', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN latitude IS NULL OR longitude IS NULL OR latitude = 0 OR longitude = 0 THEN 1 END) as missing_coords
      FROM location_export
    `);
    
    res.json({
      success: true,
      statistics: result.rows[0]
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;