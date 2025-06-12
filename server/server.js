const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

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
}
);

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

app.get('/api/location-with-sites/:site_id', async (req, res) => {
  const { site_id } = req.params;

  try {
    const locationResult = await pool.query(`
      SELECT 
        l.*,
        l.latitude,
        l.longitude 
      FROM public.site s
      JOIN public.location l ON s.location_id = l.loc_id
      WHERE l.loc_id = $1
    `, [site_id]);

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
    `, [site_id]);

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
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});