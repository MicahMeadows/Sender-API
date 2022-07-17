const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const tickLoggingController = require('../controllers/tick-logging-controller');

// user
router.post('/', userController.createUser);

// preferences
router.get('/preferences', userController.getPreferences);
router.post('/preferences', userController.updatePreferences);

// route
router.post('/tick', tickLoggingController.setTick);
router.delete('/tick/:id', tickLoggingController.removeTick);
router.get('/tick', tickLoggingController.getTicks);

module.exports = router;