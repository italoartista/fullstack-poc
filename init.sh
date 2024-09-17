#!/bin/bash

# Criar diretórios
mkdir -p ecommerce/{src/{controllers,models,services,routes},migrations,config,__tests__}

# Navegar até o diretório do projeto
cd ecommerce

# Inicializar Node.js e instalar dependências
npm init -y
npm install express pg dotenv jest supertest

# Configurar o Jest no package.json
cat <<EOT >> jest.config.js
module.exports = {
  testEnvironment: 'node',
  verbose: true,
};
EOT

# Atualizar o package.json para incluir o script de testes
sed -i '/"scripts": {/a\    "test": "jest",' package.json

# Criar o arquivo .env.test para testes (usando um banco de testes separado)
cat <<EOT >> .env.test
DATABASE_URL=postgres://yourusername:yourpassword@localhost:5432/ecommerce_test
PORT=3000
EOT

# Criar arquivo de migração SQL
cat <<EOT >> migrations/001_create_products_table.sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
EOT

# Criar script de aplicação de migrações
cat <<EOT >> src/migrate.js
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
EOT

# Criar arquivo de conexão com o banco de dados
cat <<EOT >> src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
EOT

# Criar CRUD de produtos
cat <<EOT >> src/controllers/products.js
const pool = require('../config/db');

// Create a new product
exports.createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *',
      [name, description, price, stock, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
EOT

# Criar rotas para produtos
cat <<EOT >> src/routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
EOT

# Configurar o servidor Express
cat <<EOT >> src/app.js
const express = require('express');
const productRoutes = require('./routes/products');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
EOT

# Criar testes para as rotas de produtos
cat <<EOT >> __tests__/products.test.js
const request = require('supertest');
const express = require('express');
const productRoutes = require('../src/routes/products');
require('dotenv').config({ path: './.env.test' });

const app = express();
app.use(express.json());
app.use('/products', productRoutes);

describe('Products API', () => {
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/products')
      .send({
        name: 'Test Product',
        description: 'Test Description',
        price: 10.0,
        stock: 100,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Product');
  });

  it('should retrieve all products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should retrieve a product by id', async () => {
    const res = await request(app).get('/products/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update a product', async () => {
    const res = await request(app)
      .put('/products/1')
      .send({
        name: 'Updated Product',
        description: 'Updated Description',
        price: 20.0,
        stock: 50,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe('Updated Product');
  });

  it('should delete a product', async () => {
    const res = await request(app).delete('/products/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Product deleted');
  });
});
EOT

# Executar a migração
node src/migrate.js

echo "Configuração completa! Agora você pode rodar os testes com 'npm test'."

