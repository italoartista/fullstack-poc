const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const applyMigrations = async () => {
  const migrationPath = path.join(__dirname, '../migrations/001_create_products_table.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

  try {
    await pool.query(migrationSQL);
    console.log('Migração aplicada com sucesso!');
  } catch (err) {
    console.error('Erro ao aplicar migração:', err);
  } finally {
    await pool.end();
  }
};

applyMigrations();
