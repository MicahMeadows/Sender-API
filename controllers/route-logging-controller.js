const routeLoggingModel = require('../models/route-logging/route-logging');

var addTodo = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const routeToAdd = req.body;

        await routeLoggingModel.addTodo(firestore, uid, routeToAdd); 

        res.status(200).send(routeToAdd);

    } catch (ex) {
        res.status(400).send(`Failed to add route to todo list: ${ex}`);
    }

}

var removeTodo = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const removeId = req.params.id;

        await routeLoggingModel.removeTodo(firestore, uid, removeId);

        res.status(200).send();
    } catch (ex) {
        res.status(400).send(`Failed to remove todo: ${ex}`);
    }
}


var addSend = async (req, res) => {
    try{
        const firestore = req.service.firestore;
        const uid = req.uid;
        const routeToAdd = req.body;

        await routeLoggingModel.addSend(firestore, uid, routeToAdd); 

        res.status(200).send(routeToAdd);

    } catch (ex) {
        res.status(400).send(`Failed to add route to todo list: ${ex}`);
    }

}

var removeSend = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const removeId = req.params.id;

        await routeLoggingModel.removeSend(firestore, uid, removeId);

        res.status(200).send();
    } catch (ex) {
        res.status(400).send(`Failed to remove send: ${ex}`);
    }
}

module.exports = {
    addTodo,
    removeTodo,
    addSend,
    removeSend,
}