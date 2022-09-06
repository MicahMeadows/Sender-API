// const routeScraping = require('../models/mp-route-scraping');
const routeScraping = require('../models/mp-route-scraping-new');
const routeModel = require('../models/routes/routes');
const userModel = require('../models/user/user');
const tickLogging = require('../models/route-logging/tick-logging');
const routeLogging = require('../models/route-logging/route-logging');

const findRoutesWithFilters = async (req, res) => {
    const preferences = req.body;

    const routes = await routeModel.getRouteFinderRoutesWithPreferences(preferences);

    res.status(200).send(routes);
}

const getRouteInfo = async (req, res) => {
    const firebase = req.service.firestore;
    const id = req.params.id;

    try {
        const loadedRoute = await routeLogging.getRoute(firebase, id);
        res.status(200).send(loadedRoute);
    } catch (ex) {
        res.status(404).send();
    }
}

const findRouteDetails = async (req, res) => {
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

const getSavedRouteDetails = async (req, res) => {
    try {
        const firebase = req.service.firestore;
        const routeId = req.params.id
        console.log(`id :${routeId}`)

        let routeData = await routeModel.getSavedRouteDetails(firebase, routeId);

        console.log(`route data: ${routeData}`);

        res.status(200).send(routeData);
    } catch (ex) {
        res.status(400).send(`Failed to load route: ${ex}`);
    }
}

const saveRouteDetails = async (req, res) => {
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

const getQueueRoutes = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const settings = req.body;
        const includePageData = req.query.includePageData == 'true' ? true : false;
        const numResults = req.query.numResults;
        const needImages = req.query.needImages;
2
        // get preferences for user
        const userPreferences = await userModel.getUserPreferences(firestore, uid);

        if (userPreferences == null) {
            throw 'No user preferences found.';
        }

        // get routes based on preferences
        const allPotentialRoutes = await routeModel.getRouteFinderRoutesWithPreferences(userPreferences);

        // remove sent and todod and skipped
        const savedTicks = await tickLogging.getTicks(firestore, uid);
        const savedTicksIds = savedTicks.map(route => route.id);
        const currentQueueIds = settings.ignore;
        
        const idsToRemove = [...savedTicksIds, ...currentQueueIds];
        var potentialRoutes = allPotentialRoutes.filter(({ id }) => !idsToRemove.includes(id));

        if (!includePageData) {
            res.status(200).send(potentialRoutes);
        } else {
            var routesWithImages = [];
            while (routesWithImages.length < numResults && potentialRoutes.length > 0) {
                const numRoutesNeeded = numResults - routesWithImages.length; 
                var routeBatch = potentialRoutes.slice(0, numRoutesNeeded);
                potentialRoutes = potentialRoutes.slice(numRoutesNeeded);

                var databaseRoutes = [];
                for (let route of routeBatch) {
                    const storedRoute = await routeLogging.getRoute(firestore, route.id);
                    if (storedRoute != null) {
                        databaseRoutes.push(storedRoute);
                    }
                }

                routeBatch = routeBatch.filter(({ id }) => !databaseRoutes.map(e => e.id).includes(id));

                var scrapedRoutesPageData = await routeScraping.getRouteData(routeBatch.map(e => e.id));
                var scrapedRoutes = scrapedRoutesPageData.map(pageData => {
                    const preDeatiledRoute = routeBatch.find(({ id }) => id == pageData.id);
                    return {
                        ...preDeatiledRoute,
                        firstAscent: pageData.firstAscent,
                        imageUrls: pageData.imageUrls,
                        areas: pageData.areas,
                        details: pageData.details,
                    }
                });

                scrapedRoutes.forEach(async route => {
                    await routeLogging.setRoute(firestore, route);
                });

                var allNewRoutes = databaseRoutes.concat(scrapedRoutes);

                if (needImages) {
                    allNewRoutes = allNewRoutes.filter(e => e.imageUrls != null && e.imageUrls.length > 0);
                }

                routesWithImages = routesWithImages.concat(allNewRoutes);
            }

            res.status(200).send(routesWithImages);
        }
    } catch (ex) {
        console.log(ex);
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