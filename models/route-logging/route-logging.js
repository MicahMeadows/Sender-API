const getRoutesCollection = (firestore) => firestore.collection('routes');

async function setRoute(firestore, route) {
    const routeDoc = getRoutesCollection(firestore).doc(route.id);
    await routeDoc.set({
        grade: route.grade,
        name: route.name,
        area: route.area,
        rating: route.rating,
        type: route.type,
        pitches: route.pitches,
        length: route.length,
        latitude: route.latitude,
        longitude: route.longitude,
        firstAscent: route.firstAscent,
        imageUrls: route.imageUrls,
        areas: route.areas,
        details: route.details,
    });
}

async function getRoute(firestore, routeId) {
    try {
        const routeRef = firestore.collection('routes').doc(routeId);
        const routeDoc = await routeRef.get();
        const routeData = routeDoc.data();
        return {
            id: routeId,
            ...routeData,
        }
    } catch (ex) {
        return null;
    }
}

module.exports = {
    getRoute,
    setRoute,
}