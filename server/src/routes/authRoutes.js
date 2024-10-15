const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login); // Definindo a rota de login

module.exports = router;