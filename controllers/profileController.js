// const { firestore } = require('firebase-admin');

var getPreferences = async (req, res) => {
    try {
        const firestore = req.service.firestore;
        const uid = req.uid;

        const docRef = firestore.collection('preferences').doc(uid);
        const userPreferencesResponse = await docRef.get();
        var userPreferences = userPreferencesResponse.data();

        userPreferences.areas = userPreferences.areaIds.map(async (area) => {
            let areaRef = firestore.collection('areas').doc(area.id);
            let areaResponse = await areaRef.get();
            let areaData = areaResponse.data();
            return {
                name: areaData.name,
                id: area.id
            }
        });
        delete userPreferences.areaIds;


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
        const request = req.body;
        const uid = req.uid;
        const preferences = req.body;

        const docRef = firestore.collection('preferences').doc(uid);
        await docRef.set(preferences);

        res.status(200).send(preferences);
    } catch (ex) {
        res.status(400).send(`Failed to post preferences: ${ex}`);

    }
    
};

module.exports = {
    getPreferences,
    postPreferences,
}