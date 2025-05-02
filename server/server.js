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

async function createWifiSitesTableIfNotExists() {
    const createTableQuery = `
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'province_enum') THEN
                CREATE TYPE province_enum AS ENUM ('Cavite', 'Laguna', 'Rizal', 'Quezon', 'Batangas');
            END IF;
        END
        $$;

        CREATE TABLE IF NOT EXISTS wifi_sites (
            id SERIAL PRIMARY KEY,
            lot_id VARCHAR(255),
            province province_enum,
            congressional VARCHAR(255),
            locality VARCHAR(255),
            location_name VARCHAR(255),
            site VARCHAR(255),
            category VARCHAR(255),
            longitude VARCHAR(255),
            latitude VARCHAR(255),
            site_id VARCHAR(255),
            contract_status VARCHAR(255),
            project VARCHAR(255),
            procurement VARCHAR(255),
            technology VARCHAR(255),
            link_provider VARCHAR(255),
            bandwidth VARCHAR(255),
            isp_provider VARCHAR(255),
            activation_date DATE,
            end_of_contract DATE
        );
    `;
    await pool.query(createTableQuery);
}

app.post('/api/wifisites', async (req, res) => {
    const {
        lotId, province, congressional, locality, locationName, site,
        category, longitude, latitude, siteId, contract,
        project, procurement, technology, linkProvider, bandwidth,
        ispProvider, activationDate, endOfContract
    } = req.body;

    // Validate required fields
    if (!locationName || !siteId) {
        return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Validate province
    const allowedProvinces = ['Cavite', 'Laguna', 'Rizal', 'Quezon', 'Batangas'];
    if (province && !allowedProvinces.includes(province)) {
        return res.status(400).json({ error: 'Invalid province value' });
    }

    // Validate activationDate and endOfContract
    const isValidDate = (date) => {
        return !isNaN(Date.parse(date));
    };
    if (activationDate && !isValidDate(activationDate)) {
        return res.status(400).json({ error: 'Invalid activationDate format' });
    }
    if (endOfContract && !isValidDate(endOfContract)) {
        return res.status(400).json({ error: 'Invalid endOfContract format' });
    }

    try {
        // Ensure the table exists first
        await createWifiSitesTableIfNotExists();

        const query = `
            INSERT INTO wifi_sites 
            (lot_id, province, congressional, locality, location_name, site, category, longitude, latitude,
            site_id, contract_status, project, procurement, technology, link_provider, bandwidth,
            isp_provider, activation_date, end_of_contract)
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9,
             $10, $11, $12, $13, $14, $15, $16,
             $17, $18, $19)
            RETURNING id
        `;
        const values = [
            lotId, province, congressional, locality, locationName, site, category, longitude, latitude,
            siteId, contract, project, procurement, technology, linkProvider, bandwidth,
            ispProvider, activationDate ? new Date(activationDate) : null, 
            endOfContract ? new Date(endOfContract) : null
        ];

        const result = await pool.query(query, values);

        res.status(201).json({ message: 'WiFi site added successfully', siteId: result.rows[0].id });
    } catch (error) {
        console.error('Error adding WiFi site:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});