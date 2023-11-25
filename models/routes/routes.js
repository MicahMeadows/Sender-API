const axios = require('axios');
const { Router } = require('express');

// async function getSavedRouteDetails(firebase, routeId) {
//     try {
//         const routeRef = firebase.collection('routes').doc(routeId);
//         const route = await routeRef.get();
//         const routeData = route.data();
//         return routeData;
//     } catch (ex) {
//         throw `Failed to load route: ${ex}`;
//     }
// }

// async function saveRouteDetails(firebase, route) {
//     try {
//         const routesCollectijon = firebase.collection('routes');
        
//     } catch (ex) {
//         throw `Failed to save route: ${ex}`;
//     }
// }

function getIdFromUrl(url) {
    /* url format:
        https://www.mountainproject.com/route/<id>/<name>
    */

    const split = url.split('/');
    const id = split[4];
    return id;
}

async function getRouteFinderRoutesWithPreferences(preferences) {
    const routes = await getRouteFinderRoutes(preferences);

    return routes;
}

function getRouteGradeValue(routeGrade) {
    return routeGradeValues[routeGrade];
}

const routeGradeValues = {
    '3rd': 800, '4th': 900,
    '5.0': 1000, '5.1': 1100, '5.2': 1200, '5.3': 1300, '5.4': 1400,
    '5.5': 1500, '5.6': 1600, '5.7': 1900, '5.8': 2200, '5.9': 2500,
    '5.10a': 2800, '5.10b': 3100, '5.10c': 3400, '5.10d': 3500,
    '5.11a': 4800, '5.11b': 5100, '5.11c': 5400, '5.11d': 5500,
    '5.12a': 6800, '5.12b': 7100, '5.12c': 7400, '5.12d': 7500,
    '5.13a': 8700, '5.13b': 8900, '5.13c': 9300, '5.13d': 9500,
    '5.14a': 10500, '5.14b': 10900, '5.14c': 11200, '5.14d': 11500,
    '5.15a': 11600, '5.15b': 11900, '5.15c': 12100, '5.15d': 12400,
 };

function starValueFromPreferences(rating) {
    switch (rating) {
        case 1:
            return 1.8;
        case 1.5:
            return 2.3;
        case 2:
            return 2.8;
        case 2.5:
            return 3.3;
        case 3:
            return 3.8;
        default:
            return 0;
    }
}

function fixFormatting(source) {
    return source.replaceAll('\"', '');
}

function makeRockClimbCsvRequestUrl(settings){ 
    const BASE_URL = 'https://www.mountainproject.com/route-finder-export';
    const ROCK_CLIMBS_REQUEST_URL = BASE_URL + '?' +
    `selectedIds=${settings.areaId}&` +
    `type=${settings.type}&` +
    `diffMinrock=${settings.gradeMin}&` +
    `diffMaxrock=${settings.gradeMax}&` +
    `stars=${settings.qualityRange}&` +
    `pitches=${settings.numPitches}&` +
    `sort1=${settings.filter1}&` +
    `sort2=${settings.filter2}&` +
    `is_trad_climb=${settings.showTrad}&` +
    `is_sport_climb=${settings.showSport}&` +
    `is_top_rope=${settings.showTopRope}&`;

    return ROCK_CLIMBS_REQUEST_URL;
}

const getCachedRoutesCollection = (firestore, uid) => firestore.collection('users').doc(`${uid}`).collection('queue-cache');

async function deleteCurrentCachedRoutes(firestore, uid) {
    const cacheCollection = getCachedRoutesCollection(firestore, uid);

    const snapshot = await cacheCollection.get();

    const deletePromises = snapshot.docs.map((doc) => {
        return doc.ref.delete();
    });

    return Promise.all(deletePromises);
}

async function cacheCurrentRoutes(firestore, uid, routes) {
    await deleteCurrentCachedRoutes(firestore, uid);

    const cacheCollection = getCachedRoutesCollection(firestore, uid);

    for (const route of routes) {
        console.log("Route to cache" + route)
        const routeDoc = cacheCollection.doc(route.id);
        await routeDoc.set(route);
    }
}

async function getCachedRoutes(firestore, uid) {
    const cacheCollection = getCachedRoutesCollection(firestore, uid);

    const snapshot = await cacheCollection.get();
    const routeDocs = snapshot.docs;

    const routeData = routeDocs.map(doc => {
        const route = doc.data();
        return {
            id: doc.id,
            ...route,
        }
    });

    return routeData;
}

async function getRouteFinderRoutes(preferences) {
    const requestUrl = makeRockClimbCsvRequestUrl({
        areaId: preferences.area.id,
        type: 'rock',
        gradeMin: getRouteGradeValue(preferences.minGrade),
        gradeMax: getRouteGradeValue(preferences.maxGrade),
        qualityRange: starValueFromPreferences(preferences.minRating),
        numPitches: preferences.showMultipitch ? 0 : 1, // not a boolean, 0 is any pitches, 1 is exactly 1 pitch
        filter1: 'popularity desc',
        filter2: 'rating',
        showTrad: preferences.showTrad ? 1 : 0,
        showSport: preferences.showSport ? 1 : 0,
        showTopRope: preferences.showTopRope ? 1 : 0,
    });

    const csvResponse = await axios.get(requestUrl);
    const csvData = csvResponse.data;

    const rows = csvData.split('\n');
    const attributeHeaders = rows[0].split(',').map((_header) => {
        return _header.replace(/['"]+/g, '');
    });

    let routes = [];
    for (let row = 1; row < rows.length; row++) {
        const attributesCount = rows[row].length;
        const rowData = rows[row].split(',');

        if (rowData.length != attributeHeaders.length)
            continue;

        let route = {};
        for (let col = 0; col < attributesCount; col++) {
            route[attributeHeaders[col]] = rowData[col];
        }
        const url = route['URL'];
        const routeId = getIdFromUrl(url);

        routes.push({
            id: routeId,
            grade: route.Rating,
            name: fixFormatting(route.Route),
            area: fixFormatting(route.Location),
            rating: parseFloat(route['Avg Stars']),
            type: fixFormatting(route['Route Type']),
            pitches: parseInt(route.Pitches),
            length: parseInt(route.Length),
            longitude: parseFloat(route['Area Longitude']),
            latitude: parseFloat(route['Area Latitude']),
            mountainProjectUrl: url,
        });
    }

    return routes;
}

module.exports = {
    getRouteFinderRoutesWithPreferences,
    getCachedRoutes,
    cacheCurrentRoutes,
}