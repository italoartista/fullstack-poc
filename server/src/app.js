const express = require('express');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes'); // Adicionando a rota de autenticação
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
// app.use('/newchat', chatRoutes);
app.use('/auth', authRoutes); // Adicionando a rota de autenticação

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});