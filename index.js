const express = require('express');
const routeFinderHelper = require('./business/route-finder-api-helper');

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
        searchFilters.filter1,
        searchFilters.filter2
    );
    console.log(`${routes.length} routes loaded`);

    res.status(200).send(routes);
});

// app.get('/routes/:id', async (req, res) => {
//     const { id } = req.params;

//     routeDetails = {
//         routeId: id,
//         gradeLower: '5.10a',
//         gradeUpper: '5.12b',
//         showTrad: true,
//         showSport: true,
//         showTopRope: true,
//         minRating: 0.0,
//         numPitches: 0,
//         filter1: 'area',
//         filter2: 'rating',
//     };
//     var routes = await routeFinderHelper.getRockClimbs(id, '5.10a', '5.10c');

//     res.status(200).send(routes);
//     console.log(`retreived and sent ${routes.length} routes`);
// });
