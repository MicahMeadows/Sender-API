const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');

router.get('/:id', areaController.getAreasWithId);

module.exports = router;