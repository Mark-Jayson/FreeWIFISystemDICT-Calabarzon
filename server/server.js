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
        -- Create location table
        CREATE TABLE IF NOT EXISTS public.location (
            location_id SERIAL PRIMARY KEY,
            location_name VARCHAR(100),
            province VARCHAR(100),
            congressional VARCHAR(100),
            locality VARCHAR(100),
            site_name VARCHAR(100),
            category VARCHAR(100),
            longitude NUMERIC(9,6),
            latitude NUMERIC(9,6)
        );

        -- Create apsites table
        CREATE TABLE IF NOT EXISTS public.apsites (
            site_id SERIAL PRIMARY KEY,
            site_name VARCHAR(100),
            contract_status VARCHAR(20),
            project VARCHAR(100),
            procurement VARCHAR(100),
            technology VARCHAR(100),
            link_provider VARCHAR(100),
            bandwidth INTEGER,
            isp_provider VARCHAR(100),
            activation_date DATE,
            end_of_contract DATE
        );

        -- Create connect table (junction table)
        CREATE TABLE IF NOT EXISTS public.connect (
            location_id INTEGER,
            site_id INTEGER,
            PRIMARY KEY (location_id, site_id),
            FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON DELETE CASCADE,
            FOREIGN KEY (site_id) REFERENCES public.apsites(site_id) ON DELETE CASCADE
        );
    `;
    
    try {
        await pool.query(createTablesQuery);
        console.log('Database tables created or already exist');
    } catch (error) {
        console.error('Error creating database tables:', error);
        throw error;
    }
}

app.post('/api/location', async (req, res) => {
    const {
        // Location data
        lotId, 
        province, 
        congressional, 
        locality, 
        locationName, 
        site, // site_type in the React form
        category, 
        longitude, 
        latitude,

        // AP Site data
        siteId, // site_name in the React form
        contract,
        project, 
        procurement, 
        technology, 
        linkProvider, 
        bandwidth, 
        ispProvider, 
        activationDate, 
        endOfContract
    } = req.body;

    // Validate required fields
    if (!locationName || !siteId) {
        return res.status(400).json({ error: 'Location name and AP site name are required' });
    }

    console.log('Request body:', req.body);

    // Start a transaction
    const client = await pool.connect();
    try {
        // Ensure tables exist
        await createTablesIfNotExist();
        
        await client.query('BEGIN');

        // 1. Insert into location table
        const locationQuery = `
            INSERT INTO public.location 
            (location_name, province, congressional, locality, site_name, category, longitude, latitude)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING location_id
        `;
        const locationValues = [
            locationName, 
            province, 
            congressional, 
            locality, 
            site, // using site as site_name in the location table
            category, 
            longitude ? parseFloat(longitude) : null, 
            latitude ? parseFloat(latitude) : null
        ];
        const locationResult = await client.query(locationQuery, locationValues);
        const locationId = locationResult.rows[0].location_id;

        // 2. Insert into apsites table
        const apsitesQuery = `
            INSERT INTO public.apsites 
            (site_name, contract_status, project, procurement, technology, link_provider, bandwidth, isp_provider, activation_date, end_of_contract)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING site_id
        `;
        const apsitesValues = [
            siteId, 
            contract, 
            project, 
            procurement, 
            technology, 
            linkProvider, 
            bandwidth ? parseInt(bandwidth) : null,
            ispProvider,
            activationDate ? new Date(activationDate) : null,
            endOfContract ? new Date(endOfContract) : null
        ];
        const apsitesResult = await client.query(apsitesQuery, apsitesValues);
        const siteIdResult = apsitesResult.rows[0].site_id;

        // 3. Insert into connect table (junction table)
        const connectQuery = `
            INSERT INTO public.connect (location_id, site_id)
            VALUES ($1, $2)
        `;
        await client.query(connectQuery, [locationId, siteIdResult]);

        await client.query('COMMIT');

        res.status(201).json({ 
            message: 'WiFi site added successfully', 
            locationId: locationId,
            siteId: siteIdResult
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding WiFi site:', error);
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
                l.location_id, l.province, l.congressional, l.locality,
                l.location_name, l.site_name as location_site_type, l.category, l.longitude, l.latitude
            FROM 
                public.apsites a
            JOIN 
                public.connect c ON a.site_id = c.site_id
            JOIN 
                public.location l ON c.location_id = l.location_id
        `;
        
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching WiFi sites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});