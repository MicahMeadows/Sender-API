const { ExecutionContext } = require('puppeteer');
const routeFinderHelper = require('../models/mp-route-finder');
const routeScraper = require('../models/mp-route-scraping');
const userController = require('./user-controller').default;
const routesData =require('../models/routes/routes');
const userData = require('../models/user/user');
const routeLogging = require('../models/route-logging/route-logging');

var findRoutesWithFilters = async (req, res) => {
    const preferences = req.body;

    const routes = await routesData.getRouteFinderRoutesWithPreferences(preferences);

    res.status(200).send(routes);
}

var findRouteDetails =  async (req, res) => {
    const ids = req.body;

    let routeIds = ids.map(id => id.id);

    if (routeIds.length == 0) {
        throw 'No ids found.';
    }

    try {
        const routeResults = await routeScraper.getRouteData(routeIds);
        res.status(200).send(routeResults);

    } catch (ex) {
        res.status(400).send(`Error retreiving route details: ${ex}`);
    }
}

var getQueueRoutes = async (req, res) => {
    
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;

        // get preferences for user
        const userPreferences = await userData.getUserPreferences(firestore, uid);
            
        if (userPreferences == null) {
            throw 'No user preferences found.';
        }

        // get routes based on preferences
        var routes = await routesData.getRouteFinderRoutesWithPreferences(userPreferences);

        // remove sent and todod and skipped
        var savedRoutes = await routeLogging.getRoutes(firestore, uid);
        var idsToRemove = savedRoutes.map(route => route.id);
        var filteredRoutes = routes.filter(({ id }) => !idsToRemove.includes(id));

        // return routes
        res.status(200).send(filteredRoutes);

    } catch (ex) {
        res.status(400).send(`Error retreiving queue routes: ${ex}`);
    }
}

module.exports = {
    findRouteDetails,
    findRoutesWithFilters,
    getQueueRoutes
}