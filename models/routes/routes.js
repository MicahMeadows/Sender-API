const axios = require('axios');
const routeFinder = require('../mp-route-finder');

async function getRouteFinderRoutesWithPreferences(preferences) {
    
    const requestUrl = makeRockClimbCsvRequestUrl({
        areaId: preferences.areaId,
        type: 'rock',
        gradeMin: getRouteGradeValue(preferences.minGrade),
        gradeMax: getRouteGradeValue(preferences.maxGrade),
        qualityRange: starValueFromPreferences(preferences.minStars), // find values for stars 
        numPitches: preferences.showMultipitch ? 0 : 1, // find values for pitches
        filter1: 'area',
        filter2: 'rating',
        showTrad: preferences.showTrad,
        showSport: preferences.showSport,
        showTopRope: preferences.showTopRope,
    });

    const routes = await getRouteFinderRoutes(requestUrl);

    return routes;

}

function getRouteGradeValue(routeGrade) {
    return routeGradeValues[routeGrade];
}

const routeGradeValues = {
    '3rd': 800, '4th': 900,
    '5.0': 1000, '5.1': 1100, '5.2': 1200, '5.3': 1300, '5.4': 1400,
    '5.6': 1600, '5.7': 1080, '5.8': 2000, '5.9': 2300,
    '5.10a': 2600, '5.10b': 2700, '5.10c': 3100, '5.10d': 3300, '5.11a': 4600,
    '5.11b': 4800, '5.11c': 5100, '5.11d': 5300, '5.12a': 6600, '5.12b': 6700,
    '5.12c': 7100, '5.12d': 7300, '5.13a': 8600, '5.13b': 8700, '5.13c': 9200,
    '5.13d': 9500, '5.14a': 10500, '5.14b': 10900, '5.14c': 11200, '5.14d': 11500,
    '5.15a': 11600, '5.15b': 11900, '5.15c': 12100, '5.15d': 12400,
 };

function starValueFromPreferences(minStars) {
    switch (minStars) {
        case 1:
            return 1.8;
        case 2:
            return 2.8;
        case 3:
            return 3.8;
        default:
            return 0;
    }
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

async function getRouteFinderRoutes(url) {
    const csvResponse = await axios.get(url);
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
        route.id = routeFinder.getIdFromUrl(url);

        routes.push(route);
    }

    return routes;
}

module.exports = {
    getRouteFinderRoutesWithPreferences,
}