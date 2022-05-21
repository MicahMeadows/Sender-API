const axios = require('axios');

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


async function getRockClimbs(
    areaId, 
    minYds, 
    maxYds, 
    showTrad = 1, 
    showSport = 1, 
    showTopRope = 1, 
    minRating = 0, 
    numPitches = 0, 
    filter1 = 'area', 
    filter2 = 'rating') 
{
    let REQUEST_URL = makeRockClimbCsvRequestUrl(areaId, 
        'rock', 
        routeGradeValues[minYds], 
        routeGradeValues[maxYds], 
        showTrad, 
        showSport, 
        showTopRope, 
        minRating,
        numPitches, 
        filter1,
        filter2,
    );

    return await getRoutes(REQUEST_URL);
}

function makeRockClimbCsvRequestUrl(areaId, type, gradeMin, gradeMax, 
    showTrad, showSport, showTopRope, qualityRange, numPitches,
    filter1, filter2,){ 
        const BASE_URL = 'https://www.mountainproject.com/route-finder-export';
        const ROCK_CLIMBS_REQUEST_URL = BASE_URL + '?' +
        `selectedIds=${areaId}&` +
        `type=${type}&` +
        `diffMinrock=${gradeMin}&` +
        `diffMaxrock=${gradeMax}&` +
        `stars=${qualityRange}&` +
        `pitches=${numPitches}&` +
        `sort1=${filter1}&` +
        `sort2=${filter2}&` +
        `is_trad_climb=${showTrad}&` +
        `is_sport_climb=${showSport}&` +
        `is_top_rope=${showTopRope}&`;

        return ROCK_CLIMBS_REQUEST_URL;
    }

async function getRoutes(url) {
    const csvResponse = await axios.get(url);
    const csvData = csvResponse.data;

    const rows = csvData.split('\n');
    const attributeHeaders = rows[0].split(',').map((_header) => {
        return _header.replace(/['"]+/g, '');
    });

    let routesJson = [];
    for (let row = 1; row < rows.length; row++) {
        const attributesCount = rows[row].length;
        const rowData = rows[row].split(',');

        if (rowData.length != attributeHeaders.length)
            continue;

        let jsonObject = {};
        for (let col = 0; col < attributesCount; col++) {
            jsonObject[attributeHeaders[col]] = rowData[col];
        }
        routesJson.push(jsonObject);
    }

    return routesJson;
}

module.exports = {
    getRoutes,
    getRockClimbs
}