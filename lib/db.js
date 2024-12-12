const { Pool } = require('pg');

// Load environment variables from a .env file
require('dotenv').config();

const pool = new Pool({
  user: 'team_5g',
  host: 'csce-315-db.engr.tamu.edu',
  database: 'team_5g_db',
  password: 'thindoe99',
  port: '5432',
});

module.exports = pool;