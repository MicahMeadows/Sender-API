const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const routeLoggingController = require('../controllers/route-logging-controller');

// user
router.post('/', userController.createUser);

// preferences
router.get('/preferences', userController.getPreferences);
router.patch('/preferences', userController.updatePreferences);

// todo
router.post('/todo', routeLoggingController.addTodo);
router.delete('/todo/:id', routeLoggingController.removeTodo);

// send
router.post('/send', routeLoggingController.addSend);
router.delete('/send/:id', routeLoggingController.removeSend);

module.exports = router;