const express = require('express');
const routeFinderHelper = require('./business/route-finder-api-helper');
const areaScraper = require('./business/mp-area-scraping');
const routeScraper = require('./business/mp-route-scraping');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const PORT = 8080;

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Sender API',
            description: 'Exposes endpoints to retreieve rock climbing route data.',
            contact: {
                name: 'Micah',
            },
            servers: [ 'http://localhost:8080' ],
        },
    },
    apis: ["index.js"]
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

app.listen(
    PORT, () => console.log(`were live at http://localhost${PORT}`)
);


/**
 * @swagger
 * /routes:
 *  post:
 *   description: Use to request sub areas under an id
 *   consumes:
 *      application/json
 *   parameters:
 *     - in: body   
 *       name: routeFilters
 *       schema:
 *         type: object
 *         properties:
 *           areaId:
 *             type: integer
 *           minYds:
 *             type: string
 *           maxYds:
 *             type: string
 *           showTrad:
 *             type: boolean
 *           showSport:
 *             type: boolean
 *           showTopRope:
 *             type: boolean
 *           ratingGroup:
 *             type: integer
 *           pitchesGroup:
 *             type: integer
 *           sort1:
 *             type: string
 *           sort2:
 *             type: string   
 *   requestBody:
 *      required: true
 *      content:
 *        application/json:
 *                          
 *   responses:
 *      '200': 
 *          description: sucessful response
 *      '400':
 *          description: bad request
 */
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

/**
 * @swagger
 * /areas/{id}:
 *  get:
 *   description: Use to request sub areas under an id
 *   parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID of area to look for sub areas in
 *        schema:
 *          type: integer
 *   responses:
 *      '200': 
 *          description: sucessful response
 *      '400':
 *          description: bad request
 */
app.get('/areas/:id', async (req, res) => {
    const { id } = req.params || 0;
    // const id = req.query.id || 0;
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