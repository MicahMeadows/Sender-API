const preferences = require('../models/profile/preferences');

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

var postPreferences = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;
        const newPreferences = req.body;

        await preferences.setUserPreferences(firestore, uid, newPreferences);

        res.status(200).send(newPreferences);
    } catch (ex) {
        res.status(400).send(`Failed to post preferences: ${ex}`);

    }
    
};

module.exports = {
    getPreferences,
    postPreferences,
}