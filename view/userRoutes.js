const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { route } = require('./climbingRouteRoutes');

router.get('/preferences', userController.getPreferences);
router.patch('/preferences', userController.updatePreferences);
router.post('/', userController.createUser);

module.exports = router;