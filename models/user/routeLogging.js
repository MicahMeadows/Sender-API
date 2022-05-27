// const { route } = require("../../view/climbingRouteRoutes");

async function addToRouteList(firestore, collectionName, uid, routeToAdd) {
    const routeToAddId = routeToAdd.routeId;
    const collectionRef = firestore.collection('users').doc(`${uid}`).collection(collectionName).doc(`${routeToAddId}`);

    const addRoute = await collectionRef.set({
        routeName: routeToAdd.routeName,
        grade: routeToAdd.grade,
        rating: routeToAdd.rating,
        area: routeToAdd.area,
    });
}

async function removeFromRouteList(firestore, collectionName, uid, removeId) {
    const collectionRef = firestore.collection('users').doc(`${uid}`).collection(collectionName).doc(`${removeId}`);
    await collectionRef.delete();
}

async function removeSend(firestore, uid, removeId) {
    await removeFromRouteList(firestore, 'sendList', uid, removeId);
}

async function removeTodo(firestore, uid, removeId) {
    await removeFromRouteList(firestore, 'todoList', uid, removeId);
}

async function addSend(firestore, uid, routeToAdd) {
    await addToRouteList(firestore, 'sendList', uid, routeToAdd);
}

async function addTodo(firestore, uid, routeToAdd) {
    await addToRouteList(firestore, 'todoList', uid, routeToAdd);
}

module.exports = {
    addSend,
    addTodo,
    removeTodo,
    removeSend,
}