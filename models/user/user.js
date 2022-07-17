
async function createUser(firestore, userData) {
        console.log('create user hit');
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
                routes: [],
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