const express = require('express');
const productRoutes = require('./routes/products');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
