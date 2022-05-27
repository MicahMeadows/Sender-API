const preferences = require('../models/user/user');
const userModel = require('../models/user/user');
const routeLoggingModel = require('../models/user/routeLogging');

var createUser = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const name = req.body.name;

        const newUser = await userModel.createUser(firestore, {
            uid: uid,
            name: name,
        });

        res.status(200).send(newUser);
    } catch (ex) {
        res.status(400).send(`Failed to create user. ${ex}`);
    }
}

var getPreferences = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;

        const userPreferences = await preferences.getUserPreferences(firestore, uid);

        if (userPreferences == null) {
            res.status(404).send(`Failed to find user preferences for the id: ${uid}`);
        } 
        else {
            res.status(200).send(userPreferences);
        }
    } catch (ex) {
        res.status(400).send(`Failed to get preferences: ${ex}`);

    }
};

var updatePreferences = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const newPreferences = req.body;

        await preferences.updatePreferences(firestore, uid, newPreferences);

        res.status(200).send(newPreferences);
    } catch (ex) {
        res.status(400).send(`Failed to post preferences: ${ex}`);

    }
    
};

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
    getPreferences,
    updatePreferences,
    createUser,
    addTodo,
    removeTodo,
    addSend,
    removeSend,
}