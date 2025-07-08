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

        // Reseed SERIAL sequences to avoid duplicate key issues
        await pool.query(`
            SELECT setval('location_loc_id_seq', COALESCE((SELECT MAX(loc_id) FROM public.location), 0));
        `);
        await pool.query(`
            SELECT setval('site_site_id_seq', COALESCE((SELECT MAX(site_id) FROM public.site), 0));
        `);

        console.log('Location and site tables created or already exist. Sequences reseeded.');
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
                s.site_id, 
                s.site_name, 
                s.contract_status, 
                s.bandwidth, 
                s.link_provider, 
                s.activation_date, 
                s.end_of_contract,
                l.location_name, 
                l.province, 
                l.locality
            FROM 
                public.site s
            JOIN public.location l ON s.location_id = l.loc_id
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
            l.congressional_district,
            l.province,
            l.locality,
            l.category,
            l.cluster,
            l.isterminated
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


app.get('/api/location-with-sites/:location_id', async (req, res) => {
    const { location_id } = req.params;

    try {
        // Corrected query to use location_id and join on loc_id
        const locationResult = await pool.query(`
        SELECT 
            l.*,
            l.latitude,
            l.longitude 
        FROM public.location l
        WHERE l.loc_id = $1
        `, [location_id]); // Use location_id directly, not site_id

        if (locationResult.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found for the given location ID' });
        }

        const locationData = locationResult.rows[0];

        // Corrected query to fetch sites for the given location_id
        const sitesResult = await pool.query(`
        SELECT
            s.site_id,
            s.site_code,
            s.site_name,
            s.contract_status AS status,
            s.site_type AS technology,
            s.latitude,
            s.longitude
        FROM public.site s
        WHERE s.location_id = $1;
        `, [locationData.loc_id]); // Use loc_id from the fetched location data

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
    const { province } = req.query;

    try {
        let whereClause = '';
        const values = [];

        if (province && province !== 'all') {
            whereClause = 'WHERE l.province ILIKE $1';
            values.push(province);
        }

        const totalResult = await pool.query(
            `SELECT COUNT(*) FROM public.site s JOIN public.location l ON s.location_id = l.loc_id ${whereClause}`,
            values
        );

        const activeResult = await pool.query(
            `SELECT COUNT(*) FROM public.site s JOIN public.location l ON s.location_id = l.loc_id ${whereClause} AND s.contract_status = 'ACTIVE'`,
            values
        );

        const terminatedResult = await pool.query(
            `SELECT COUNT(*) FROM public.site s JOIN public.location l ON s.location_id = l.loc_id ${whereClause} AND s.contract_status = 'TERMINATED'`,
            values
        );

        const forRenewalResult = await pool.query(
            `SELECT COUNT(*) FROM public.site s JOIN public.location l ON s.location_id = l.loc_id ${whereClause} AND s.contract_status = 'FOR RENEWAL'`,
            values
        );

        const unknownResult = await pool.query(
            `SELECT COUNT(*) FROM public.site s JOIN public.location l ON s.location_id = l.loc_id ${whereClause} AND (s.contract_status IS NULL OR s.contract_status NOT IN ('ACTIVE', 'TERMINATED', 'FOR RENEWAL'))`,
            values
        );

        const totalSites = parseInt(totalResult.rows[0].count);
        const activeSites = parseInt(activeResult.rows[0].count);
        const terminatedSites = parseInt(terminatedResult.rows[0].count);
        const forRenewalSites = parseInt(forRenewalResult.rows[0].count);
        const unknownSites = parseInt(unknownResult.rows[0].count);

        let activePercentage = 0;
        let terminatedPercentage = 0;
        let forRenewalPercentage = 0;
        let unknownPercentage = 0;

        if (totalSites > 0) {
            activePercentage = Math.round((activeSites / totalSites) * 100);
            terminatedPercentage = Math.round((terminatedSites / totalSites) * 100);
            forRenewalPercentage = Math.round((forRenewalSites / totalSites) * 100);
            unknownPercentage = 100 - (activePercentage + terminatedPercentage + forRenewalPercentage);
        }

        res.status(200).json({
            totalSites,
            activeSites,
            terminatedSites,
            forRenewalSites,
            unknownSites,
            activePercentage,
            terminatedPercentage,
            forRenewalPercentage,
            unknownPercentage,
            trendValue: "0%",
            isPositiveTrend: true,
        });
    } catch (error) {
        console.error('Error fetching WiFi stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/expiring-contracts', async (req, res) => {
    const { province } = req.query;

    try {
        let filter = '';
        const values = [];

        if (province && province !== 'all') {
            filter = `JOIN public.location l ON s.location_id = l.loc_id WHERE l.province ILIKE $1 AND s.end_of_contract IS NOT NULL`;
            values.push(province);
        } else {
            filter = `WHERE s.end_of_contract IS NOT NULL`;
        }

        const result = await pool.query(
            `SELECT s.site_name, s.end_of_contract
       FROM public.site s
       ${filter.includes('JOIN') ? filter : ` ${filter}`}`,
            values
        );

        const monthMap = {
            jan: '01', feb: '02', mar: '03', apr: '04',
            may: '05', jun: '06', jul: '07', aug: '08',
            sep: '09', oct: '10', nov: '11', dec: '12'
        };

        const today = new Date();

        const parsedContracts = result.rows.map(row => {
            const raw = row.end_of_contract?.trim();
            if (!raw) return null; // Handle null or empty string for end_of_contract
            const parts = raw.split('-'); // e.g., '30-Mar-25'

            if (parts.length !== 3) {
                // Try parsing if it's already in ISO format (YYYY-MM-DD)
                const isoParsed = new Date(raw);
                if (!isNaN(isoParsed) && isoParsed.toISOString().slice(0, 10) === raw) {
                    return { site: row.site_name, parsed: isoParsed, iso: raw };
                }
                return null;
            }

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
    const { province } = req.query;

    try {
        let whereClause = '';
        const values = [];

        if (province && province !== 'all') {
            whereClause = `JOIN public.location l ON s.location_id = l.loc_id WHERE l.province ILIKE $1`;
            values.push(province);
        }

        const result = await pool.query(
            `SELECT s.activation_date
       FROM public.site s
       ${whereClause.includes('JOIN') ? whereClause : ` ${whereClause}`}`,
            values
        );

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

            // Attempt to parse as Date object if it's already one
            if (raw instanceof Date) {
                const year = raw.getFullYear();
                if (year && yearCounts.hasOwnProperty(year)) {
                    yearCounts[year]++;
                }
                continue;
            }

            const parts = raw.toString().trim().split(/[-\/]/); // e.g. "20-Mar" or "19-Mar-20" or "2023-01-15"

            let year = null;

            if (parts.length === 2) {
                // "20-Mar" → March 2020
                const [dayOrYearStr, monStr] = parts;
                const month = monthMap[monStr.toLowerCase()];
                let parsedYear = parseInt(dayOrYearStr);

                // This part is tricky if "20-Mar" can mean 2020 or 20th of March in current year
                // Assuming "YY-MMM" format implies year first (e.g., "20-Mar" is Mar 2020)
                year = parsedYear < 100 ? (2000 + parsedYear) : parsedYear; // Adjust to full year
                if (month === undefined) { // If 'Mar' is actually a year like '20' and '20' is a month
                    // This scenario needs better logic if inputs are ambiguous like '20-03'
                    // For now, assume 'YY-MMM' always means YY is the year.
                    year = parseInt(dayOrYearStr.length === 2 ? `20${dayOrYearStr}` : dayOrYearStr);
                }


            } else if (parts.length === 3) {
                // "19-Mar-20" → March 19, 2020 (day-month-year)
                // "2023-01-15" (year-month-day)
                const [p1, p2, p3] = parts;

                // Check for YYYY-MM-DD format
                if (p1.length === 4 && p2.length <= 2 && p3.length <= 2) {
                    year = parseInt(p1);
                } else { // Assume DD-Mon-YY format
                    const monStr = p2;
                    const yy = p3;
                    const month = monthMap[monStr.toLowerCase()];
                    year = parseInt(yy.length === 2 ? `20${yy}` : yy);
                }
            }

            if (year && yearCounts.hasOwnProperty(year)) {
                yearCounts[year]++;
            } else if (year) {
                // If year is outside the predefined range but valid, count it
                yearCounts[year] = (yearCounts[year] || 0) + 1;
            }
        }

        // Sort years for consistent output, especially if new years were added
        const sortedYears = Object.keys(yearCounts).sort((a, b) => parseInt(a) - parseInt(b));

        const formatted = sortedYears.map((year) => ({
            year,
            value: yearCounts[year]
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

app.get('/api/site-types', async (req, res) => {
    const { province } = req.query;

    try {
        let whereClause = '';
        const values = [];

        if (province && province !== 'all') {
            whereClause = 'JOIN public.location l ON s.location_id = l.loc_id WHERE l.province ILIKE $1';
            values.push(province);
        }

        const result = await pool.query(`
      SELECT s.site_type, COUNT(*) as count
      FROM public.site s
      ${whereClause.includes('JOIN') ? whereClause : ''}
      GROUP BY s.site_type
      ORDER BY count DESC
    `, values);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching site types:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/top-lgus', async (req, res) => {
    const { province } = req.query;

    try {
        let query;
        let values = [];

        if (province && province !== 'all') {
            // Top 5 LGUs from the selected province
            query = `
        SELECT 
          l.locality, 
          l.province, 
          COUNT(s.site_id) AS wifi_count
        FROM public.site s
        JOIN public.location l ON s.location_id = l.loc_id
        WHERE l.province ILIKE $1 AND l.locality IS NOT NULL
        GROUP BY l.locality, l.province
        ORDER BY wifi_count DESC
        LIMIT 5;
      `;
            values = [province];
        } else {
            // Top 1 LGU per province in Calabarzon
            query = `
        SELECT DISTINCT ON (l.province)
          l.province,
          l.locality,
          COUNT(s.site_id) AS wifi_count
        FROM public.site s
        JOIN public.location l ON s.location_id = l.loc_id
        WHERE l.province IN ('Cavite', 'Laguna', 'Batangas', 'Rizal', 'Quezon')
          AND l.locality IS NOT NULL
        GROUP BY l.province, l.locality
        ORDER BY l.province, wifi_count DESC;
      `;
        }

        const result = await pool.query(query, values);

        const transformed = result.rows.map((row, index) => ({
            id: `${index + 1}`,
            name: row.locality,
            subtext: row.province,
            value: row.wifi_count,
        }));

        res.status(200).json(transformed);
    } catch (error) {
        console.error('Error fetching top LGUs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/provinces', async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT DISTINCT INITCAP(TRIM(province)) AS province
        FROM public.location
        WHERE province IS NOT NULL AND TRIM(province) != ''
        ORDER BY province ASC
    `);

        const provinces = result.rows.map(row => ({
            id: row.province.toLowerCase(),
            name: row.province
        }));

        // Prepend the 'all' option for Region IV‑A
        provinces.unshift({ id: 'all', name: 'Region IV - A Calabarzon' });

        res.status(200).json(provinces);
    } catch (err) {
        console.error('Error fetching provinces:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/location-distribution', async (req, res) => {
    const { province } = req.query;

    try {
        if (province && province !== 'all') {
            const totalResult = await pool.query(`
        SELECT COUNT(DISTINCT l.loc_id) AS total_locations
        FROM public.location l
        JOIN public.site s ON l.loc_id = s.location_id
        WHERE l.province ILIKE $1
      `, [province]);

            const perLocalityResult = await pool.query(`
        SELECT INITCAP(TRIM(l.locality)) AS name,
               COUNT(DISTINCT l.loc_id) AS location_count
        FROM public.location l
        JOIN public.site s ON l.loc_id = s.location_id
        WHERE l.province ILIKE $1 AND l.locality IS NOT NULL
        GROUP BY name
        ORDER BY location_count DESC
      `, [province]);

            return res.status(200).json({
                total: parseInt(totalResult.rows[0].total_locations),
                provinces: perLocalityResult.rows.map((row) => ({
                    name: row.name,
                    count: parseInt(row.location_count),
                })),
            });
        }

        // Default case: Region IV‑A (all provinces)
        const totalResult = await pool.query(`
      SELECT COUNT(DISTINCT l.loc_id) AS total_locations
      FROM public.location l
      JOIN public.site s ON l.loc_id = s.location_id
      WHERE l.province IN ('Cavite', 'Laguna', 'Batangas', 'Rizal', 'Quezon')
    `);

        const perProvinceResult = await pool.query(`
      SELECT INITCAP(TRIM(l.province)) AS name,
             COUNT(DISTINCT l.loc_id) AS location_count
      FROM public.location l
      JOIN public.site s ON l.loc_id = s.location_id
      WHERE l.province IN ('Cavite', 'Laguna', 'Batangas', 'Rizal', 'Quezon')
      GROUP BY name
      ORDER BY location_count DESC
    `);

        res.status(200).json({
            total: parseInt(totalResult.rows[0].total_locations),
            provinces: perProvinceResult.rows.map((row) => ({
                name: row.name,
                count: parseInt(row.location_count),
            })),
        });
    } catch (err) {
        console.error('Error fetching location distribution:', err);
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
app.get('/api/getProvince/:locality', async (req, res) => {
    const { locality } = req.params; // Extract locality from URL parameters

    try {
        // 1. Get the province from the locality
        const provinceResult = await pool.query(`
            SELECT province
            FROM public.location
            WHERE locality = $1;
        `, [locality]);

        // Check if a province was found for the given locality
        if (provinceResult.rows.length === 0) {
            return res.status(404).json({ error: `No province found for locality: "${locality}"` });
        }

        // Extract the province name.
        // It's crucial to access the 'province' property from the first row.
        const provinceName = provinceResult.rows[0].province;

        const cities = await pool.query(`
            SELECT DISTINCT locality
            FROM public.location
            WHERE province = $1;
        `, [provinceName]);

        const citys = cities.rows.map(row => ({
            locality: row.locality
        }));

        // 2. Get all locations within that province
        const locationsResult = await pool.query(`
            SELECT *
            FROM public.location
            WHERE province = $1;
        `, [provinceName]); // Use provinceName here, not the entire provinceResult object

        const locationsOfProvince = locationsResult.rows;
        const numberOfLocations = locationsOfProvince.length;

        // 3. Get all sites within that province
        const sitesResult = await pool.query(`
            SELECT
                s.*, -- Select all columns from the site table
                l.locality,
                l.province,
                l.location_name -- Include relevant location details if needed
            FROM
                public.site s
            JOIN
                public.location l ON s.location_id = l.loc_id
            WHERE
                l.province = $1;
        `, [provinceName]); // Use provinceName here

        const sitesOfProvince = sitesResult.rows;
        const numberOfSites = sitesOfProvince.length;

        // Prepare the response object
        res.status(200).json({
            province: provinceName, // Return the province name
            cities: citys, // Array of location objects
            sites: sitesOfProvince, // Array of site objects
            numberOfLocations: numberOfLocations,
            numberOfSites: numberOfSites
        });

    } catch (error) {
        console.error(`Error fetching data for locality "${locality}":`, error);
        res.status(500).json({ error: 'Internal server error while fetching data.' });
    }
});


// NEW ENDPOINT: Fetch key metrics like GIDA, ELCAC, and Digitization status
app.get('/api/key-metrics', async (req, res) => {
    const { province } = req.query;

    try {
        let whereClause = '';
        const values = [];

        if (province && province !== 'all') {
            whereClause = 'WHERE l.province ILIKE $1';
            values.push(province);
        }

        // Fetch GIDA count
        // **IMPORTANT**: Replace 'GIDA' with the actual value in your 'category' or 'cluster' column
        // that identifies GIDA locations/sites.
        const gidaResult = await pool.query(
            `SELECT COUNT(DISTINCT l.loc_id) FROM public.location l
            JOIN public.site s ON l.loc_id = s.location_id
             ${whereClause} AND l.category = 'GIDA'`, // Adjust 'l.category' and 'GIDA' as per your schema
            values
        );
        const gidaCount = parseInt(gidaResult.rows[0].count);

        // Fetch ELCAC count
        // **IMPORTANT**: Replace 'ELCAC' with the actual value in your 'category' or 'cluster' column
        // that identifies ELCAC locations/sites.
        const elcacResult = await pool.query(
            `SELECT COUNT(DISTINCT l.loc_id) FROM public.location l
            JOIN public.site s ON l.loc_id = s.location_id
             ${whereClause} AND l.category = 'ELCAC'`, // Adjust 'l.category' and 'ELCAC' as per your schema
            values
        );
        const elcacCount = parseInt(elcacResult.rows[0].count);

        // Fetch Digitization data (e.g., based on active sites with a specific site_type)
        // **IMPORTANT**: Define what "digitization" means. This example assumes sites with 'site_type' = 'Digital'.
        // Adjust 's.site_type' and 'Digital' to match your criteria.
        const totalDigitizationCandidatesResult = await pool.query(
            `SELECT COUNT(DISTINCT s.site_id) FROM public.site s
            JOIN public.location l ON s.location_id = l.loc_id
             ${whereClause} AND s.site_type = 'Digital'`, // Example condition, replace 'Digital' with actual criteria
            values
        );
        const activeDigitizationResult = await pool.query(
            `SELECT COUNT(DISTINCT s.site_id) FROM public.site s
            JOIN public.location l ON s.location_id = l.loc_id
             ${whereClause} AND s.site_type = 'Digital' AND s.contract_status = 'ACTIVE'`, // Example condition
            values
        );

        const totalDigitizationCount = parseInt(totalDigitizationCandidatesResult.rows[0].count);
        const activeDigitizationCount = parseInt(activeDigitizationResult.rows[0].count);

        let digitizationPercentage = 0;
        if (totalDigitizationCount > 0) {
            digitizationPercentage = Math.round((activeDigitizationCount / totalDigitizationCount) * 100);
        }

        res.status(200).json({
            gidaCount,
            elcacCount,
            digitization: {
                percentage: digitizationPercentage,
                totalCount: totalDigitizationCount,
                activeCount: activeDigitizationCount,
                description: 'Sites contributing to digitization efforts', // Customize this description
            },
        });

    } catch (error) {
        console.error('Error fetching key metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/recently-added-sites', async (req, res) => {
    const { province } = req.query;

    try {
        const values = [];
        let filterClause = `LOWER(s.contract_status) = 'active' AND s.activation_date IS NOT NULL`;

        if (province && province.toLowerCase() !== 'all') {
            filterClause += ` AND l.province ILIKE $1`;
            values.push(province);
        } else {
            filterClause += ` AND LOWER(l.province) IN ('cavite', 'laguna', 'batangas', 'rizal', 'quezon')`;
        }

        const result = await pool.query(`
            SELECT 
                s.site_id,
                s.site_name,
                s.contract_status AS status,
                s.activation_date,
                l.province,
                l.locality AS municipality
            FROM public.site s
            JOIN public.location l ON s.location_id = l.loc_id
            WHERE ${filterClause}
        `, values);

        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const recentlyAdded = result.rows
            .map(row => {
                const parsedDate = new Date(row.activation_date);
                if (isNaN(parsedDate)) return null;

                if (parsedDate < thirtyDaysAgo || parsedDate > today) return null;

                const diffTime = Math.abs(today - parsedDate);
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                return {
                    site_id: row.site_id,
                    site_name: row.site_name,
                    province: row.province,
                    municipality: row.municipality,
                    status: row.status || 'ACTIVE',
                    date_added: `${parsedDate.getMonth() + 1}/${parsedDate.getDate()}/${parsedDate.getFullYear()}`,
                    days_ago: diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
                };
            })
            .filter(Boolean)
            .sort((a, b) => new Date(b.date_added) - new Date(a.date_added));

        res.status(200).json(recentlyAdded);
    } catch (error) {
        console.error('❌ Error fetching recently added sites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/api/recently-terminated-sites', async (req, res) => {
    const { province } = req.query;

    try {
        const values = [];
        let filterClause = `(s.contract_status = 'TERMINATED' OR s.contract_status = 'ACTIVE') AND s.end_of_contract IS NOT NULL`;

        if (province && province.toLowerCase() !== 'all') {
            filterClause += ` AND l.province ILIKE $1`;
            values.push(province);
        } else {
            filterClause += ` AND LOWER(l.province) IN ('cavite', 'laguna', 'batangas', 'rizal', 'quezon')`;
        }

        const result = await pool.query(`
      SELECT 
        s.site_id,
        s.site_name,
        s.contract_status AS status,
        s.end_of_contract,
        l.province,
        l.locality AS municipality
      FROM public.site s
      JOIN public.location l ON s.location_id = l.loc_id
      WHERE ${filterClause}
    `, values);

        const now = new Date();

        const monthMap = {
            jan: '01', feb: '02', mar: '03', apr: '04',
            may: '05', jun: '06', jul: '07', aug: '08',
            sep: '09', oct: '10', nov: '11', dec: '12'
        };

        const recentlyTerminated = result.rows.map(row => {
            const raw = row.end_of_contract?.trim().toLowerCase();
            let parsedDate = null;

            try {
                const match = raw.match(/^(\d{1,2})-([a-z]{3})-(\d{2})$/i);
                if (!match) return null;

                const [_, dayStr, monStr, yyStr] = match;
                const day = parseInt(dayStr);
                const month = monthMap[monStr.toLowerCase()];
                const year = 2000 + parseInt(yyStr);

                if (!day || !month || isNaN(year)) return null;

                const isoDate = `${year}-${month}-${String(day).padStart(2, '0')}`;
                parsedDate = new Date(isoDate);

                if (isNaN(parsedDate)) return null;

                // ✅ Only include if the date is in the past or today
                if (parsedDate > now) return null;

                return {
                    site_id: row.site_id,
                    site_name: row.site_name,
                    status: row.status === 'ACTIVE' ? 'EXPIRED' : row.status, // Label ACTIVES with past dates as EXPIRED
                    province: row.province,
                    municipality: row.municipality,
                    date_terminated: isoDate,
                    _parsedDate: parsedDate
                };
            } catch {
                return null;
            }
        })
            .filter(Boolean)
            .sort((a, b) => b._parsedDate - a._parsedDate)
            .slice(0, 20)
            .map(({ _parsedDate, ...rest }) => rest);

        res.status(200).json(recentlyTerminated);
    } catch (error) {
        console.error('❌ Error fetching recently terminated sites:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});