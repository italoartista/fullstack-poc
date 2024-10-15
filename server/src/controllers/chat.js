
const Chat = require('../models/chat.js');


exports.module = function createChat(req, res) {
  const { name, description } = req.body;
  const chat = new Chat({ name, description });
  chat.save()
    .then((chat) => {
      res.status(201).json(chat);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
}

exports.module = function getChats(req, res) {
    Chat.find()
        .then((chats) => {
        res.status(200).json(chats);
        })
        .catch((error) => {
        res.status(400).json(error);
        });
}

exports.module =function getChatById(req, res) {
    const { id } = req.params;
    Chat.findById(id)
        .then((chat) => {
        res.status(200).json(chat);
        })
        .catch((error) => {
        res.status(400).json(error);
        });
}

exports.module = function updateChat(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;
    Chat.findByIdAndUpdate({ _id: id }, { name, description })
        .then((chat) => {
        res.status(200).json(chat);
        })
        .catch((error) => {
        res.status(400).json(error);
        });
}
exports.module = function deleteChat(req, res) {
    const { id } = req.params;
    Chat.findByIdAndDelete(id)
        .then(() => {
        res.status(200).json({ message: `Chat with id ${id} deleted` });
        })
        .catch((error) => {
        res.status(400).json(error);
        });
}


