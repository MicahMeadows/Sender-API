const { get } = require('cheerio/lib/api/traversing');
const routeLoggingModel = require('../models/route-logging/route-logging');
const { route } = require('../view/climbing-route-routes');

var setRoute = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;

        await routeLoggingModel.setRoute(firestore, uid, req.body); 

        res.status(200).send(req.body);

    } catch (ex) {
        res.status(400).send(`Failed to add route to todo list: ${ex}`);
    }

}

var removeRoute = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const removeId = req.params.id;

        await routeLoggingModel.removeRoute(firestore, uid, removeId);

        res.status(200).send();
    } catch (ex) {
        res.status(400).send(`Failed to remove todo: ${ex}`);
    }
}

var getRoutes = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;

        const routes = await routeLoggingModel.getRoutes(firestore, uid);

        res.status(200).send(routes);
    } catch (ex) {
        res.status(400).send(`Failed to get stored routes: ${ex}`);
    }
}

module.exports = {
    setRoute,
    removeRoute,
    getRoutes,
}