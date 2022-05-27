async function getUserPreferences(firestore, uid) {
        const docRef = firestore.collection('preferences').doc(uid);
        const userPreferencesResponse = await docRef.get();
        var userPreferences = userPreferencesResponse.data();

        // userPreferences.areas = userPreferences.areaIds.map(async (area) => {
        //     let areaRef = firestore.collection('areas').doc(area.id);
        //     let areaResponse = await areaRef.get();
        //     let areaData = areaResponse.data();
        //     return {
        //         name: areaData.name,
        //         id: area.id
        //     }
        // });
        // delete userPreferences.areaIds;
        return userPreferences;
};

async function setUserPreferences(firestore, uid, preferences) {
        const docRef = firestore.collection('preferences').doc(uid);
        await docRef.set(preferences);
}


module.exports = {
    getUserPreferences,
    setUserPreferences
}