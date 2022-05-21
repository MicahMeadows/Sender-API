const routeFinderHelper = require('../models/mp-route-finder');
const routeScraper = require('../models/mp-route-scraping');

var findRoutesWithFilters = async (req, res) => {
    const searchFilters = req.body;
    
    let routes = await routeFinderHelper.getRockClimbs(
        searchFilters.areaId,
        searchFilters.minYds,
        searchFilters.maxYds,
        searchFilters.showTrad ? 1 : 0,
        searchFilters.showSport ? 1 : 0,
        searchFilters.showTopRope ? 1 : 0,
        searchFilters.ratingGroup,
        searchFilters.pitchesGroup,
        searchFilters.sort1,
        searchFilters.sort2
    );
    console.log(`${routes.length} routes loaded`);

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

module.exports = {
    findRouteDetails,
    findRoutesWithFilters
}