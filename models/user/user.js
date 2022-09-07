
async function createUser(firestore, userData) {

        const newPrefs = {
                area: {
                        id: "0",
                        level: 0,
                        name: "All Locations:"
                },
                maxGrade: "5.9",
                minGrade: "5.12a",
                minRating: 2,
                showMultipitch: true,
                showSport: true,
                showTrad: true,
                showTopRope: true
        };


        await firestore.collection('users').doc(userData.uid).set({
                name: userData.profile.displayName,
                preferences: newPrefs
        }, {
                merge: true,
        });

        return {
                uid: userData.uid,
                email: userData.profile.email,
                displayName: userData.profile.displayName,
                routePreferences: newPrefs,
        }
}

async function getUserPreferences(firestore, uid) {
        try {
                const userRef = firestore.collection('users').doc(uid);
                const userDoc = await userRef.get();
                const userData = userDoc.data();
                return userData.preferences;
        } catch (ex) {
                throw `Failed to get user preferences: ${ex}`;
        }
};

async function updatePreferences(firestore, uid, preferences) {

        const userRef = firestore.collection('users').doc(uid);
        await userRef.update({
                preferences: preferences,
        });
}


module.exports = {
        getUserPreferences,
        updatePreferences,
        createUser,
}