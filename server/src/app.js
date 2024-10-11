const express = require('express');
const chatRoutes = require('./routes/chatRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/newchat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
