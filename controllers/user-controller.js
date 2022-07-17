const preferences = require('../models/user/user');
const userModel = require('../models/user/user');
const routeLoggingModel = require('../models/route-logging/tick-logging');

var createUser = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const name = req.body.name;

        console.log('new user should try make', req.body);

        const newUser = await userModel.createUser(firestore, {
            uid: uid,
            name: name,
        });

        console.log('new user', newUser);

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

        console.log(`user pref: ${userPreferences}`);

        res.status(200).send(userPreferences);
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