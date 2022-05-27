const { ExecutionContext } = require('puppeteer');
const routeFinderHelper = require('../models/mp-route-finder');
const routeScraper = require('../models/mp-route-scraping');
const userController = require('./user-controller').default;
const routesData =require('../models/routes/routes');
const userData = require('../models/user/user');
const routeLogging = require('../models/route-logging/route-logging');

var findRoutesWithFilters = async (req, res) => {
    const preferences = req.body;

    const routes = await routesData.getRoutesWithPreferences(preferences);

    res.status(200).send(routes);
}

var findRouteDetails =  async (req, res) => {
    const ids = req.body;

    let routeIds = [];
    try {
        for (let i = 0; i < ids.length; i++) {
            routeIds.push(ids[i].id);
        }
    } catch (e) {
        res.status(400).send('Bad request, please check your input.');
    }

    if (routeIds.length == 0) {
        res.status(404).send('There were no route ids found.');
    } else {
        let result = await routeScraper.getRouteData(routeIds);
        res.status(200).send(result);
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
        var routes = await routesData.getRoutesWithPreferences(userPreferences);

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