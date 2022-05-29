const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const routeLoggingController = require('../controllers/route-logging-controller');

// user
router.post('/', userController.createUser);

// preferences
router.get('/preferences', userController.getPreferences);
router.post('/preferences', userController.updatePreferences);

// route
router.post('/route', routeLoggingController.setRoute);
router.delete('/route/:id', routeLoggingController.removeRoute);
router.get('/route', routeLoggingController.getRoutes);

module.exports = router;