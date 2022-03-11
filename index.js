const express = require('express');
const routeFinderHelper = require('./business/route-finder-api-helper');
const areaScraper = require('./business/mp-area-scraping');
const routeScraper = require('./business/mp-route-scraping');

const app = express();

const PORT = 8080;

app.use(express.json());

app.listen(
    PORT, () => console.log(`were live at http://localhost${PORT}`)
);

app.post('/routes', async (req, res) => {
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
        searchFilters.sort1
    );
    console.log(`${routes.length} routes loaded`);

    res.status(200).send(routes);
});

app.get('/areas', async (req, res) => {
    // const { id } = req.params;
    const id = req.query.id || 0;
    console.log(`attemping to get areas for ${id}`);

    try {
        var subAreas = await areaScraper.getSubAreas(id);

        res.status(200).send(subAreas);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/route-details/:id', async (req, res) => {
    const { id } = req.params;

    if (id == '') {
        res.status(400).send('Please enter a route id.');
    }

    var result = await routeScraper.getRouteData(id);
    if (result == null) {
        res.status(404).send(`Could not find route for id ${id}`);
    }
    res.status(400).send(result);

});