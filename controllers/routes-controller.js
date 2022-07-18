// const routeScraping = require('../models/mp-route-scraping');
const routeScraping = require('../models/mp-route-scraping-new');
const routeModel =require('../models/routes/routes');
const userModel = require('../models/user/user');
const tickLogging = require('../models/route-logging/tick-logging');
const routeLogging = require('../models/route-logging/route-logging');
const { filter } = require('domutils');

var findRoutesWithFilters = async (req, res) => {
    const preferences = req.body;

    const routes = await routeModel.getRouteFinderRoutesWithPreferences(preferences);

    res.status(200).send(routes);
}

var getRouteInfo = async (req, res) => {
    const firebase = req.service.firestore;
    const id = req.params.id;

    try {
        const loadedRoute = await routeLogging.getRoute(firebase, id);
        res.status(200).send(loadedRoute); 
    } catch (ex) {
        res.status(404).send();
    }
}

var findRouteDetails =  async (req, res) => {
    const ids = req.body;

    let routeIds = ids.map(id => id.id);

    if (routeIds.length == 0) {
        throw 'No ids found.';
    }

    try {
        const routeResults = await routeScraping.getRouteData(routeIds);
        res.status(200).send(routeResults);

    } catch (ex) {
        res.status(400).send(`Error retreiving route details: ${ex}`);
    }
}

var getSavedRouteDetails = async (req, res) => {
    try {
        const firebase = req.service.firestore;
        const routeId = req.params.id
        console.log(`id :${routeId}`)

        var routeData = await routeModel.getSavedRouteDetails(firebase, routeId);

        console.log(`route data: ${routeData}`);

        res.status(200).send(routeData);
    } catch (ex) {
        res.status(400).send(`Failed to load route: ${ex}`);
    }
}

var saveRouteDetails = async (req, res) => {
    try {
        const firebase = req.service.firestore;
        const route = req.body;
        console.log(`route: ${route}`);

        await routeModel.saveRouteDetails(firebase, route);

        res.status(200).send(route);
    } catch (ex) {
        res.status(400).send(`Cannot add: ${ex}`);
    }
}

var getQueueRoutes = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const settings = req.body;
        var includePageData = req.query.includePageData == 'true' ? true : false;
        var numResults = req.query.numResults;

        // get preferences for user
        const userPreferences = await userModel.getUserPreferences(firestore, uid);
            
        if (userPreferences == null) {
            throw 'No user preferences found.';
        }

        // get routes based on preferences
        const routes = await routeModel.getRouteFinderRoutesWithPreferences(userPreferences);

        // remove sent and todod and skipped
        const savedRoutes = await tickLogging.getTicks(firestore, uid);
        const savedRoutesIds = savedRoutes.map(route => route.id);
        const currentQueueIds = settings.ignore;
        const idsToRemove = [...savedRoutesIds, ...currentQueueIds];
        var filteredRoutes = routes.filter(({ id }) => !idsToRemove.includes(id));

        if (numResults != null) {
            filteredRoutes = filteredRoutes.slice(0, numResults); 
        }

        if (!includePageData) {
            res.status(200).send(filteredRoutes);
        } else {
            var databaseRoutes = [];
            var routesIdsToFill = filteredRoutes.map(e => e.id);
            routesIdsToFill.forEach(async id => {
                const storedRoute = await routeLogging.getRoute(firestore, id);
                if (storedRoute != null) {
                    routesIdsToFill.filter(e => e.id != id);
                    databaseRoutes.push(storedRoute);
                }
            });

            var scrapedRoutes = await routeScraping.getRouteData(routesIdsToFill);

            const mergedRoutes = scrapedRoutes.map(route => {
                const preDeatiledRoute = filteredRoutes.find(({ id }) => id == route.id);
                return {
                    ...preDeatiledRoute,
                    firstAscent: route.firstAscent,
                    imageUrls: route.imageUrls,
                    areas: route.areas,
                    details: route.details,
                }
            });

            mergedRoutes.forEach(async route => {
                await routeLogging.setRoute(firestore, route);
            });

            var allRoutes = [...databaseRoutes, ...mergedRoutes];

            res.status(200).send(allRoutes);
        }
    } catch (ex) {
        res.status(400).send(`Error retreiving queue routes: ${ex}`);
    }
}

module.exports = {
    findRouteDetails,
    findRoutesWithFilters,
    getQueueRoutes,
    getSavedRouteDetails,
    saveRouteDetails,
    getRouteInfo,
}