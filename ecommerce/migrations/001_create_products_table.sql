-- CREATE TABLE IF NOT EXISTS products (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(100) NOT NULL,
--   description TEXT,
--   price DECIMAL(10, 2) NOT NULL,
--   stock INT NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS product_categories (
  product_id INT REFERENCES products(id),
  category_id INT REFERENCES categories(id),
  PRIMARY KEY (product_id, category_id)
);

CREATE TABLE IF NOT EXISTS price_history (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  price DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP
);