const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database:', err);
    } else {
        console.log('Connected to PostgreSQL database at:', res.rows[0].now);
    }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if email exists
        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: result.rows[0].id,
                name: result.rows[0].name,
                email: result.rows[0].email
            }
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if user exists
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function createTablesIfNotExist() {
    const createTablesQuery = `
        CREATE TABLE IF NOT EXISTS public.location (
            loc_id SERIAL PRIMARY KEY,
            location_id VARCHAR(50) UNIQUE NOT NULL,
            location_name VARCHAR(100) NOT NULL,
            province VARCHAR(100),
            congressional_district VARCHAR(100),
            locality VARCHAR(100),
            category VARCHAR(100),
            cluster VARCHAR(100),
            latitude NUMERIC(9,6),
            longitude NUMERIC(9,6),
            isterminated BOOLEAN,
            CONSTRAINT unique_location_composite UNIQUE (province, locality, location_name)
        
            );

        CREATE TABLE IF NOT EXISTS public.site (
            site_id SERIAL PRIMARY KEY,
            location_id INTEGER NOT NULL REFERENCES public.location(loc_id) ON DELETE CASCADE,
            site_code VARCHAR(100) NOT NULL,
            site_name VARCHAR(100),
            contract_status VARCHAR(20),
            activation_date DATE,
            end_of_contract DATE,   
            contract VARCHAR(100),
            site_type VARCHAR(100),
            cms_provider VARCHAR(100),
            link_provider VARCHAR(100),
            bandwidth INTEGER,
            latitude NUMERIC(9,6),
            longitude NUMERIC(9,6),
            date_accepted DATE,
            date_declaration DATE,
            CONSTRAINT unique_site_code UNIQUE (site_code)
        );

        CREATE INDEX IF NOT EXISTS idx_location_name ON public.location(location_name);
        CREATE INDEX IF NOT EXISTS idx_province ON public.location(province);
        CREATE INDEX IF NOT EXISTS idx_locality ON public.location(locality);
    `;

    try {
        await pool.query(createTablesQuery);
        console.log('Location and site tables created or already exist.');
    } catch (error) {
        console.error('Error creating database tables:', error);
        throw error;
    }
}

// Initialize tables when server starts
(async () => {
    try {
        await createTablesIfNotExist();
    } catch (error) {
        console.error('Failed to initialize database tables:', error);
    }
})();

// Search locations endpoint - improved with better error handling
app.get('/api/location/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const searchQuery = `
            SELECT * FROM public.location
            WHERE
                location_id ILIKE $1 OR 
                location_name ILIKE $1 OR
                province ILIKE $1 OR
                locality ILIKE $1 OR
                congressional_district ILIKE $1
            ORDER BY location_name
            LIMIT 10
        `;

        const result = await pool.query(searchQuery, [`%${query}%`]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error searching locations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
 
// Get location by ID
app.get('/api/locations/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = 'SELECT * FROM public.location WHERE location_id = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/location', async (req, res) => {
    const {
        // Location data
        locationID,
        locationName,
        province,
        congDistrict,
        locality,
        category,
        cluster,

        // Site data
        sideCode,
        siteName,
        contractStatus,
        dateActivation,
        dateEndContract,
        contract,
        siteType,
        cmsProvider,
        linkProvider,
        bandwidth,
        latitude,
        longitude,
        termination,
        year,
        dateAccepted,
        dateDeclaration
    } = req.body;

    if (!locationID || !locationName || !sideCode) {
        return res.status(400).json({ error: 'Location ID, Location name, and Site Code are required' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Check if location already exists
        const locationCheck = await client.query(
            'SELECT loc_id FROM public.location WHERE location_id = $1',
            [locationID]
        );

        let locId;

        if (locationCheck.rows.length > 0) {
            // Update existing location
            locId = locationCheck.rows[0].loc_id;

            await client.query(`
                UPDATE public.location
                SET location_name = $1, province = $2, congressional_district = $3,
                    locality = $4, category = $5, cluster = $6
                WHERE location_id = $7
            `, [locationName, province, congDistrict, locality, category, cluster, locationID]);

        } else {
            // Insert new location with RETURNING loc_id
            const locationResult = await client.query(`
                INSERT INTO public.location (
                    location_id, location_name, province, congressional_district, locality, category, cluster
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING loc_id
            `, [locationID, locationName, province, congDistrict, locality, category, cluster]);

            locId = locationResult.rows[0].loc_id;
        }

        // Check if site already exists
        const siteCheck = await client.query(
            'SELECT site_id FROM public.site WHERE site_code = $1',
            [sideCode]
        );

        if (siteCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Site with this code already exists' });
        }

        // Insert into site table
        const siteInsert = `
        INSERT INTO public.site (
            location_id, site_code, site_name, contract_status, activation_date, end_of_contract,
            contract, site_type, cms_provider, link_provider, bandwidth,
            latitude, longitude, date_accepted, date_declaration
        ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11,
            $12, $13, $14, $15
        ) RETURNING site_id
        `;
 
        const siteValues = [
            locId,
            sideCode,
            siteName,
            contractStatus,
            dateActivation ? new Date(dateActivation) : null,
            dateEndContract ? new Date(dateEndContract) : null,
            contract,
            siteType,
            cmsProvider,
            linkProvider,
            isNaN(parseInt(bandwidth)) ? null : parseInt(bandwidth),
            latitude ? parseFloat(latitude) : null,
            longitude ? parseFloat(longitude) : null,
            dateAccepted ? new Date(dateAccepted) : null,
            dateDeclaration ? new Date(dateDeclaration) : null
        ];

        const siteResult = await client.query(siteInsert, siteValues);

        await client.query('COMMIT');

        res.status(201).json({
            message: 'WiFi site added successfully',
            locationId: locationID,
            locId: locId,
            siteId: siteResult.rows[0].site_id
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding location/site:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
});

// Get all WiFi sites with location data
app.get('/api/wifisites', async (req, res) => {
    try {
        const query = `
            SELECT 
                a.site_id, a.site_name, a.contract_status, a.project, a.procurement,
                a.technology, a.link_provider, a.bandwidth, a.isp_provider, 
                a.activation_date, a.end_of_contract,
                l.location_id, l.province, l.congressional_district, l.locality,
                l.location_name, l.site_name as location_site_type, l.category, l.longitude, l.latitude
            FROM 
                public.apsites a
            JOIN public.location l ON a.location_id = l.loc_id
        `;

        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching WiFi sites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/map-pins', async (req, res) => {

    try {
        const result = await pool.query(`
      SELECT 
        s.site_id,
        s.site_code,
        s.site_name,
          s.location_id, 
        l.latitude,
        l.longitude,
        l.location_name,
        l.province,
        l.locality,
        l.category,
        l.cluster
      FROM public.site s
      JOIN public.location l ON s.location_id = l.loc_id
     WHERE l.latitude IS NOT NULL AND l.longitude IS NOT NULL
    `);


        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching map pins:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/getLocationsOfProvince/:locality', async (req, res) => {
  const { locality } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        l.*
      FROM
        public.location l
      WHERE
        l.locality = $1
    `, [locality]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No locations found for the specified locality.' });
    }

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error fetching locations by locality:', error);
    res.status(500).json({ error: 'Internal server error while fetching locations.' });
  }
});

app.get('/api/getLocationsOfProvince/:locality', async (req, res) => {
  const { locality } = req.params;

  try {
    const result = await pool.query(`
      SELECT
        l.*
      FROM
        public.site s
      JOIN
        public.location l ON s.location_id = l.loc_id
      WHERE
        l.locality = $1
    `, [locality]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No locations found for the specified locality.' });
    }

    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error fetching locations by locality:', error);
    res.status(500).json({ error: 'Internal server error while fetching locations.' });
  }
});

// NEW ENDPOINT: Get the total number of sites for a given locality
app.get('/api/sitesByLocality/:locality', async (req, res) => {
    const { locality } = req.params; // Extract locality from URL parameters

    try {
        // SQL query to select all site rows associated with the given locality
        // It joins 'public.Site' and 'public.Location' tables on their respective IDs
        // and filters by the 'locality' column from 'public.Location'.
        const sitesResult = await pool.query(`
            SELECT
                s.site_id,          
                s.site_name,       
                s.location_id,       
                l.locality,         
                l.province           
            FROM
                public.site s
            JOIN
                public.Location l ON s.location_id = l.loc_id
            WHERE
                l.locality = $1;
        `, [locality]);

        const sites = sitesResult.rows; // Array of site objects

        // The total number of sites is simply the count of rows returned by the query
        const totalSitesCount = sites.length;


res.status(200).json({ sites, totalSitesCount: parseInt(totalSitesCount, 10) });

        // Send a successful JSON response with the sites data and their total count
            // res.status(200).json(sitesResult.rows);
    } catch (error) {
        console.error(`Error fetching sites for locality "${locality}":`, error);
        // Send an error response in case of any server-side issues
        res.status(500).json({ error: 'Internal server error while fetching sites by locality.' });
    }
});
// ////////////////////////////////
// app.get('/api/getTotalSitesByLocality/:locality', async (req, res) => {''

//   const { locality } = req.params;



//   try {

//     // Query to count the number of distinct locations that belong to the given locality

//     // and are also associated with an entry in the 'public.site' table.

//     // We use COUNT(DISTINCT l.loc_id) to ensure each unique location is counted once,

//     // even if it might be referenced multiple times in the 'site' table (though less common).

//     const result = await pool.query(`

//       SELECT

//         COUNT(DISTINCT l.loc_id) AS total_sites_count

//       FROM

//         public.location l

//       JOIN

//         public.site s ON l.loc_id = s.location_id

//       WHERE

//         l.locality = $1

//     `, [locality]);



//     // The result will always have at least one row, even if the count is 0.

//     const totalSitesCount = result.rows[0].total_sites_count;



//     // Send the count as a JSON response

//     res.status(200).json({ locality, totalSitesCount: parseInt(totalSitesCount, 10) });



//   } catch (error) {

//     console.error('Error counting sites by locality:', error);

//     res.status(500).json({ error: 'Internal server error while fetching site count.' });

//   }

// });


/////////////////////////////////
app.get('/api/location-with-sites/:location_id', async (req, res) => {
    const { location_id } = req.params;

    try {
        const locationResult = await pool.query(`
      SELECT 
        l.*,
        l.latitude,
        l.longitude 
      FROM public.site s
      JOIN public.location l ON s.location_id = l.loc_id
      WHERE l.loc_id = $1
    `, [location_id]);

        if (locationResult.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found for the given site ID' });
        }

        const locationData = locationResult.rows[0];


    const sitesResult = await pool.query(`
     SELECT
  s.site_id,
  s.site_name,
  s.contract_status AS status,
  s.site_type AS technology
FROM public.site s
WHERE s.location_id = $1;
 `, [location_id]);

        res.status(200).json({
            ...locationData,
            apSites: sitesResult.rows
        });

    } catch (err) {
        console.error('Error fetching location with sites:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});






app.get('/api/site/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
      SELECT 
        s.*, 
        l.location_name
      FROM public.site s
      JOIN public.location l ON s.location_id = l.loc_id
      WHERE s.site_id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Site not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching site:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/wifi-stats', async (req, res) => {
    try {
        const totalResult = await pool.query('SELECT COUNT(*) FROM public.site');
        const activeResult = await pool.query("SELECT COUNT(*) FROM public.site WHERE contract_status = 'ACTIVE'");
        const terminatedResult = await pool.query("SELECT COUNT(*) FROM public.site WHERE contract_status = 'TERMINATED'");

        const totalSites = parseInt(totalResult.rows[0].count);
        const activeSites = parseInt(activeResult.rows[0].count);
        const terminatedSites = parseInt(terminatedResult.rows[0].count);

        // Calculate percentages with rounding correction to ensure 100%
        let activePercentage = 0;
        let terminatedPercentage = 0;
        if (totalSites > 0) {
            activePercentage = Math.round((activeSites / totalSites) * 100);
            terminatedPercentage = 100 - activePercentage;
        }

        res.status(200).json({
            totalSites,
            activeSites,
            terminatedSites,
            activePercentage,
            terminatedPercentage,
            trendValue: "0%", // You can later make this dynamic if you track changes
            isPositiveTrend: true
        });
    } catch (error) {
        console.error('Error fetching WiFi stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/expiring-contracts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT site_name, end_of_contract
      FROM public.site
      WHERE end_of_contract IS NOT NULL
    `);

    const monthMap = {
      jan: '01', feb: '02', mar: '03', apr: '04',
      may: '05', jun: '06', jul: '07', aug: '08',
      sep: '09', oct: '10', nov: '11', dec: '12'
    };

    const today = new Date();

    const parsedContracts = result.rows.map(row => {
      const raw = row.end_of_contract?.trim();
      const parts = raw.split('-'); // e.g., '30-Mar-25'

      if (parts.length !== 3) return null;

      const [dayStr, monthStr, yearStr] = parts;
      const day = parseInt(dayStr);
      const month = monthMap[monthStr.toLowerCase()];
      const year = parseInt(yearStr);

      if (!month || isNaN(day) || isNaN(year)) return null;

      const fullYear = year < 100 ? 2000 + year : year;
      const dateStr = `${fullYear}-${month}-${String(day).padStart(2, '0')}`;
      const parsed = new Date(dateStr);

      return !isNaN(parsed)
        ? { site: row.site_name, parsed, iso: dateStr }
        : null;
    });

    const upcomingContracts = parsedContracts
      .filter(entry => entry && entry.parsed > today) // 💡 only future dates
      .sort((a, b) => a.parsed - b.parsed)
      .slice(0, 10)
      .map(entry => ({
        site: entry.site,
        date: entry.iso
      }));

    res.status(200).json(upcomingContracts);
  } catch (err) {
    console.error('Error fetching expiring contracts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/yearly-activations', async (req, res) => {
  try {
    const result = await pool.query(`SELECT activation_date FROM public.site`);

    const yearCounts = {};
    const yearRange = Array.from({ length: 10 }, (_, i) => 2016 + i); // [2016..2025]
    yearRange.forEach(y => yearCounts[y] = 0);

    const monthMap = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };

    let noDate = 0;

    for (const row of result.rows) {
      const raw = row.activation_date;

      if (!raw) {
        noDate++;
        continue;
      }

      const parts = raw.toString().trim().split(/[-\/]/); // e.g. "20-Mar" or "19-Mar-20"

      let year = null;

      if (parts.length === 2) {
        // "20-Mar" → March 2020
        const [yy, monStr] = parts;
        const month = monthMap[monStr.toLowerCase()];
        year = parseInt(yy.length === 2 ? `20${yy}` : yy); // support "20" or "2020"
      } else if (parts.length === 3) {
        // "19-Mar-20" → March 19, 2020
        const [dayStr, monStr, yy] = parts;
        const month = monthMap[monStr.toLowerCase()];
        year = parseInt(yy.length === 2 ? `20${yy}` : yy);
      }

      if (year && yearCounts.hasOwnProperty(year)) {
        yearCounts[year]++;
      }
    }

    const formatted = Object.entries(yearCounts).map(([year, count]) => ({
      year,
      value: count
    }));

    res.json({
      yearlyData: formatted,
      noDate
    });

  } catch (err) {
    console.error('Error in /api/yearly-activations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Haversine distance function (calculates distance in km)
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
} 

app.post('/api/update-location-coordinates', async (req, res) => {
    const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
    if (!MAPBOX_ACCESS_TOKEN) {
        return res.status(500).json({ error: 'Mapbox Access Token not configured in environment variables.' });
    }

    const allowedProvinces = [
        'Laguna', 'Cavite', 'Batangas', 'Rizal', 'Quezon'
    ].map(p => p.toLowerCase()); // Convert to lowercase for case-insensitive comparison

    let updatedCount = 0;
    let newCoordinatesAddedCount = 0;
    let errors = [];
    let outsideProvinceCount = 0;
    let noSuitableFeatureFoundCount = 0; // New counter

    try {
        // Fetch all locations
        const locationsResult = await pool.query(
            'SELECT loc_id, location_name, locality, province, latitude, longitude FROM public.location'
        );
        const locations = locationsResult.rows;

        for (const location of locations) {
            const { loc_id, location_name, locality, province, latitude, longitude } = location;

            // Construct search query for Mapbox
            const searchQuery = `${location_name}, ${locality || ''}, ${province || ''}`.trim();
            if (!searchQuery) {
                errors.push(`Skipping loc_id ${loc_id}: Insufficient information for geocoding.`);
                continue;
            }

            try {
                // Call Mapbox Geocoding API
                const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
                const mapboxResponse = await axios.get(mapboxUrl);

                let suitableFeature = null;

                if (mapboxResponse.data.features && mapboxResponse.data.features.length > 0) {
                    // Iterate through Mapbox results to find one in an allowed province
                    for (const feature of mapboxResponse.data.features) {
                        const context = feature.context || [];
                        const mapboxProvince = context.find(c => c.id.startsWith('region.'))?.text;

                        if (mapboxProvince && allowedProvinces.includes(mapboxProvince.toLowerCase())) {
                            suitableFeature = feature;
                            break; // Found a suitable feature, stop iterating
                        }
                    }

                    if (suitableFeature) {
                        const [newLon, newLat] = suitableFeature.center; // Mapbox returns [longitude, latitude]
                        let shouldUpdate = false;

                        if (latitude === null || longitude === null) {
                            // If coordinates are blank, just add them
                            shouldUpdate = true;
                            newCoordinatesAddedCount++;
                        } 

                        if (shouldUpdate) {
                            await pool.query(
                                'UPDATE public.location SET latitude = $1, longitude = $2 WHERE loc_id = $3',
                                [newLat, newLon, loc_id]
                            );
                            console.log(`Updated loc_id ${loc_id}: New coordinates (${newLat}, ${newLon}) from suitable Mapbox feature.`);
                        } else {
                            console.log(`Loc_id ${loc_id}: Coordinates within 5km, no update needed.`);
                        }
                    } else {
                        console.log(`No suitable Mapbox result found within allowed provinces for loc_id ${loc_id}: ${searchQuery}`);
                        noSuitableFeatureFoundCount++;
                        errors.push(`No suitable Mapbox result found within allowed provinces for loc_id ${loc_id}: ${searchQuery}`);
                    }
                } else {
                    errors.push(`No Mapbox results for loc_id ${loc_id}: ${searchQuery}`);
                }
            } catch (mapboxError) {
                console.error(`Error geocoding loc_id ${loc_id} (${searchQuery}):`, mapboxError.message);
                errors.push(`Mapbox API error for loc_id ${loc_id}: ${mapboxError.message}`);
            }
        }

        res.status(200).json({
            message: 'Location coordinates update process completed.',
            updatedCount: updatedCount,
            newCoordinatesAdded: newCoordinatesAddedCount,
            outsideProvinceCount: noSuitableFeatureFoundCount, // Renamed to reflect comprehensive skipping
            errors: errors.length > 0 ? errors : null,
            totalProcessed: locations.length
        });

    } catch (error) {
        console.error('Error in /api/update-location-coordinates:', error);
        res.status(500).json({ error: 'Internal server error during coordinate update process.' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
