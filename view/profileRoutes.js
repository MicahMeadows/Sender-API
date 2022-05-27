const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/preferences', profileController.getPreferences);
router.post('/preferences', profileController.postPreferences);

module.exports = router;