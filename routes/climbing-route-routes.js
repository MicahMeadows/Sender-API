const express = require('express');
const router = express.Router();
const routesController = require('../controllers/routes-controller');

router.post('/', routesController.findRoutesWithFilters);
router.post('/details', routesController.findRouteDetails);
router.get('/:id/details', routesController.getRouteInfo);
router.post('/queue', routesController.getQueueRoutes);

module.exports = router;