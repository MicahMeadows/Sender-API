const preferences = require('../models/user/user');
const userModel = require('../models/user/user');
const routeLoggingModel = require('../models/route-logging/route-logging');

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

module.exports = {
    getPreferences,
    updatePreferences,
    createUser,
}