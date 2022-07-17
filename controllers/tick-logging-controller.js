const routeLoggingModel = require('../models/route-logging/tick-logging');

var setTick = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;

        await routeLoggingModel.setTick(firestore, uid, req.body); 

        res.status(200).send(req.body);

    } catch (ex) {
        res.status(400).send(`Failed to add route to todo list: ${ex}`);
    }

}

var removeTick = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const removeId = req.params.id;

        await routeLoggingModel.removeTick(firestore, uid, removeId);

        res.status(200).send();
    } catch (ex) {
        res.status(400).send(`Failed to remove todo: ${ex}`);
    }
}

var getTicks = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;

        const routes = await routeLoggingModel.getTicks(firestore, uid);

        res.status(200).send(routes);
    } catch (ex) {
        res.status(400).send(`Failed to get stored routes: ${ex}`);
    }
}

module.exports = {
    setTick,
    removeTick,
    getTicks,
}