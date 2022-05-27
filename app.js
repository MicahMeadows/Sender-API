const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const firebaseServiceAccount = require('./config/firebaseServiceAccountKey.json');
const firebaseAdmin = require('firebase-admin');
const checkAuth = require('./middleware/firebaseAuth');



// routes
const climbingRouteRoutes = require('./view/climbingRouteRoutes');
const areaRoutes = require('./view/areasRoutes');
const profileRoutes = require('./view/profileRoutes');


firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseServiceAccount)
});

const firestore = getFirestore();

const firebaseServices = () => {
    return Object.freeze({
        firestore,
    });
};

const exposeFirebaseServices = (req, res, next) => {
    req.service = firebaseServices();
    next();
}

const app = express();

const port = process.env.PORT || 8080;

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

// app.use('/profile', exposeFirebaseServices, checkAuth);
// app.use('/areas', exposeFirebaseServices);

app.use('/routes/queue', checkAuth);

app.use('/routes', climbingRouteRoutes);
app.use('/areas', exposeFirebaseServices, areaRoutes);
app.use('/profile', exposeFirebaseServices, checkAuth, profileRoutes);

app.listen(
    port, () => console.log(`were live at http://localhost:${port}`)
);