const express = require('express');
const router = express.Router();
const routesController = require('../controllers/routes-controller');

router.post('/', routesController.findRoutesWithFilters);
router.post('/details', routesController.findRouteDetails);
router.post('/queue', routesController.getQueueRoutes);

// saved
// router.get('/saved/:id', routesController.getSavedRouteDetails);
// router.post('/saved', routesController.saveRouteDetails);

module.exports = router;