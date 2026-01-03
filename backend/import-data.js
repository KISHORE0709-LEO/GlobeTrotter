const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'globetrotter_db',
  password: process.env.DB_PASSWORD || 'Kishore@07',
  port: process.env.DB_PORT || 5432,
});

// Import destinations
async function importDestinations(csvFile) {
  console.log('Importing destinations...');
  const destinations = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on('data', (row) => {
        destinations.push(row);
      })
      .on('end', async () => {
        try {
          for (const dest of destinations) {
            // Insert country if not exists
            await pool.query(`
              INSERT INTO countries (name, iso_code, currency, timezone) 
              VALUES ($1, $2, 'USD', 'UTC') 
              ON CONFLICT (name) DO NOTHING
            `, [dest.country_name, dest.country_name.substring(0,3).toUpperCase()]);
            
            // Get country ID
            const countryResult = await pool.query('SELECT id FROM countries WHERE name = $1', [dest.country_name]);
            const countryId = countryResult.rows[0].id;
            
            // Insert city
            await pool.query(`
              INSERT INTO cities (name, country_id, latitude, longitude, population, average_cost_per_day) 
              VALUES ($1, $2, $3, $4, $5, $6) 
              ON CONFLICT (name, country_id) DO UPDATE SET
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                population = EXCLUDED.population,
                average_cost_per_day = EXCLUDED.average_cost_per_day
            `, [dest.name, countryId, dest.latitude, dest.longitude, dest.population, dest.average_cost_per_day]);
          }
          console.log(`✅ Imported ${destinations.length} destinations`);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
  });
}

// Import attractions
async function importAttractions(csvFile) {
  console.log('Importing attractions...');
  const attractions = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on('data', (row) => {
        attractions.push(row);
      })
      .on('end', async () => {
        try {
          for (const attr of attractions) {
            // Get city ID
            const cityResult = await pool.query('SELECT id FROM cities WHERE name = $1', [attr.city_name]);
            if (cityResult.rows.length === 0) {
              console.log(`⚠️  City '${attr.city_name}' not found for attraction '${attr.name}'`);
              continue;
            }
            
            const cityId = cityResult.rows[0].id;
            
            // Insert attraction
            await pool.query(`
              INSERT INTO attractions (name, city_id, category, description, latitude, longitude, 
                                     average_visit_duration, average_cost, rating, image_url, website_url) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            `, [attr.name, cityId, attr.category, attr.description, attr.latitude, attr.longitude,
                attr.average_visit_duration, attr.average_cost, attr.rating, attr.image_url, attr.website_url]);
          }
          console.log(`✅ Imported ${attractions.length} attractions`);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
  });
}

// Import trip categories
async function importTripCategories(csvFile) {
  console.log('Importing trip categories...');
  const categories = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on('data', (row) => {
        categories.push(row);
      })
      .on('end', async () => {
        try {
          // Create trip_categories table if not exists
          await pool.query(`
            CREATE TABLE IF NOT EXISTS trip_categories (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              category VARCHAR(100) UNIQUE NOT NULL,
              description TEXT,
              icon VARCHAR(50),
              color VARCHAR(50),
              image_url TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
          `);
          
          for (const cat of categories) {
            await pool.query(`
              INSERT INTO trip_categories (category, description, icon, color, image_url) 
              VALUES ($1, $2, $3, $4, $5)
              ON CONFLICT (category) DO UPDATE SET
                description = EXCLUDED.description,
                icon = EXCLUDED.icon,
                color = EXCLUDED.color,
                image_url = EXCLUDED.image_url
            `, [cat.category, cat.description, cat.icon, cat.color, cat.image_url]);
          }
          console.log(`✅ Imported ${categories.length} trip categories`);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
  });
}

// Main import function
async function importAllData() {
  try {
    console.log('🚀 Starting data import...');
    
    // Check if CSV files exist and import them
    const files = {
      destinations: './data/destinations.csv',
      attractions: './data/attractions.csv',
      categories: './data/trip_categories.csv'
    };
    
    for (const [type, file] of Object.entries(files)) {
      if (fs.existsSync(file)) {
        console.log(`📁 Processing ${file}...`);
        if (type === 'destinations') await importDestinations(file);
        if (type === 'attractions') await importAttractions(file);
        if (type === 'categories') await importTripCategories(file);
      } else {
        console.log(`⚠️  ${file} not found, skipping ${type}`);
      }
    }
    
    console.log('✅ Data import completed successfully!');
    console.log('🎉 Your website now has real-time data with filtering!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  importAllData();
}

module.exports = { importDestinations, importAttractions, importTripCategories };