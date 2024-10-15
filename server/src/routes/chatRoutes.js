const { Router} = require('express');
const { createChat, getChats, getChatById, updateChat, deleteChat }  = require('../controllers/chat');

const router = Router();

router.post('/', createChat);
router.get('/', getChats);
router.get('/:id', getChatById);
router.put('/:id', updateChat);
router.delete('/:id', deleteChat);


module.exports = { router };


