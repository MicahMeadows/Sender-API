const express = require('express');
const router = express.Router();
const routesController = require('../controllers/routesController');

router.post('/', routesController.findRoutesWithFilters);
router.post('/details', routesController.findRouteDetails);
router.get('/queue', routesController.getQueueRoutes);

module.exports = router;