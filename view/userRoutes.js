const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { route } = require('./climbingRouteRoutes');

// user
router.post('/', userController.createUser);

// preferences
router.get('/preferences', userController.getPreferences);
router.patch('/preferences', userController.updatePreferences);

// todo
router.post('/todo', userController.addTodo);
router.delete('/todo/:id', userController.removeTodo);

// send
router.post('/send', userController.addSend);
router.delete('/send/:id', userController.removeSend);

module.exports = router;