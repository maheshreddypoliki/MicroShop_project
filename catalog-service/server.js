const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const products = [
  { id: 1, name: "Mechanical Keyboard", price: 129.99, stock: 45 },
  { id: 2, name: "Ultrawide Monitor", price: 499.99, stock: 12 },
  { id: 3, name: "Ergonomic Desk Chair", price: 299.99, stock: 8 }
];

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: "healthy", uptime: process.uptime() });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Catalog service running on port ${PORT}`);
});
