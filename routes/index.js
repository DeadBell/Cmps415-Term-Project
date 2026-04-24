// routes/index.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const TopicController = require('../controllers/TopicController');
const MessageController = require('../controllers/MessageController');

//login
router.get('/', (req,res) => {
  res.redirect('/login');
});

// auth
router.get('/login', AuthController.showLogin);
router.post('/login', AuthController.login);
router.get('/register', AuthController.showRegister);
router.post('/register', AuthController.register);

// dashboard
router.get('/dashboard', AuthController.requireLogin, TopicController.dashboard);

// topics
router.get('/topics', AuthController.requireLogin, TopicController.listAll);
router.post('/topics', AuthController.requireLogin, TopicController.create);
router.post('/topics/:id/subscribe', AuthController.requireLogin, TopicController.subscribe);
router.post('/topics/:id/unsubscribe', AuthController.requireLogin, TopicController.unsubscribe);

// messages
router.post('/topics/:id/messages', AuthController.requireLogin, MessageController.postMessage);

// stats
router.get('/stats/topics', TopicController.topicStats);

module.exports = router;
