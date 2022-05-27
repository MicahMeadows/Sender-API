var getRoutesCollection = (firestore, uid) => firestore.collection('users').doc(`${uid}`).collection('routes');

async function setRoute(firestore, uid, body) {
    const routesCollection = getRoutesCollection(firestore, uid);
    const routeDocument = routesCollection.doc(body.id);

    await routeDocument.set({
        name: body.name,
        grade: body.grade,
        rating: body.rating,
        area: body.area,
        type: body.type,
    });
}

async function getRoutes(firestore, uid) {
    const routesCollection = getRoutesCollection(firestore, uid);
    const snapshot = await routesCollection.get();
    const routeDocs = snapshot.docs;
    
    const routeData = routeDocs.map(doc => {
        const routeData = doc.data();
        return {
            id: doc.id,
            name: routeData.name,
            grade: routeData.grade,
            rating: routeData.rating,
            area: routeData.area,
            type: routeData.type,
        };
    });

    return routeData;
}

async function removeRoute(firestore, uid, removeId) {
    const routesCollection = getRoutesCollection(firestore, uid);
    const routeDocument = routesCollection.doc(removeId);
    await routeDocument.delete();
        
}

module.exports = {
    setRoute,
    removeRoute,
    getRoutes,
}