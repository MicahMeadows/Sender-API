const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// routes
const climbRouteRoutes = require('./routes/climbingRouteRoutes');
const areaRoutes = require('./routes/areasRoutes');

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

app.use('/routes', climbRouteRoutes);
app.use('/areas', areaRoutes);

app.listen(
    PORT, () => console.log(`were live at http://localhost${PORT}`)
);