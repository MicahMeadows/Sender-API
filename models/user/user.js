async function createUser(firestore, userData) {
        const userRef = firestore.collection('users').doc(userData.uid);
        
        await firestore.runTransaction(async (t) => {
                const userDoc = await t.get(userRef);
                const existing = userDoc.data();
                if (existing == null) {
                        t.set(userRef, {
                                name: userData.name,
                                preferences: null,
                        });
                } else {
                        throw new Error('User already exists');
                }
        });
        return {
                uid: userData.uid,
                name: userData.name,
                preferences: null,
        }
}

async function getUserPreferences(firestore, uid) {
        const userRef = firestore.collection('users').doc(uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        return userData.preferences;
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