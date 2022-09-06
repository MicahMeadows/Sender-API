const express = require('express');
// const swaggerJsdoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const firebaseServiceAccount = require('./config/firebaseServiceAccountKey.json');
const firebaseAdmin = require('firebase-admin');
const checkAuth = require('./middleware/firebaseAuth');
const cors = require('cors');


// routes
const climbingRouteRoutes = require('./routes/climbing-route-routes');
const areaRoutes = require('./routes/areas-routes');
const userRoutes = require('./routes/user-routes');


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
// const swaggerOptions = {
//     swaggerDefinition: {
//         info: {
//             title: 'Sender API',
//             description: 'Exposes endpoints to retreieve rock climbing route data.',
//             contact: {
//                 name: 'Micah',
//             },
//             servers: [ 'http://localhost:8080' ],
//         },
//     },
//     apis: ["index.js"]
// }
// 
// const swaggerDocs = swaggerJsdoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(cors());
app.use(express.json());

app.use('/routes/queue', checkAuth);

app.use('/routes', exposeFirebaseServices, climbingRouteRoutes);
app.use('/areas', exposeFirebaseServices, areaRoutes);
app.use('/user', exposeFirebaseServices, checkAuth, userRoutes);

app.listen(
    port, () => console.log(`were live at http://localhost:${port}`)
);