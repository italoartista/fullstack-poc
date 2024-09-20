const { Pool } = require('pg');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports =  pool;