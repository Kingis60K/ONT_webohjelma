-- Educational use only in a closed environment.

CREATE DATABASE IF NOT EXISTS ont_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ont_shop;

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  color VARCHAR(50) NULL,
  price DECIMAL(10,2) NOT NULL,
  visible TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, category, color, price, visible) VALUES
  ('T-Shirt', 'clothing', 'Black', 19.99, 1),
  ('Jeans', 'clothing', 'Blue', 49.99, 1),
  ('Jacket', 'clothing', 'Green', 89.99, 1),
  ('Sneakers', 'clothing', 'Red', 79.99, 0),
  ('Sneakers', 'clothing', 'Blue', 79.99, 0);
