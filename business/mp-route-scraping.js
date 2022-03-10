
const puppeteer = require('puppeteer');

module.exports.getRouteData = getRouteData

async function getRouteData(routeId) {
    const routeRequestUrl = `https://www.mountainproject.com/route/${routeId}`;

    let browser = await puppeteer.launch({headless: true});

    let page = await browser.newPage();

    await page.goto(routeRequestUrl, { waitUntil: 'networkidle2' });

    let routeDetails = await page.evaluate(() => {
        let routePage = document.getElementById('route-page');
        let routeName = routePage.getElementsByTagName('h1')[0].innerText;
        let routeGrade = routePage.getElementsByTagName('h2')[0].getElementsByTagName('span')[0].innerText.split(' ')[0];
        let routeRatingText = document.getElementById('route-star-avg').innerText.trimStart().replace('Avg:', '').trimStart();
        let routeRating = parseFloat(routeRatingText.substring(0, routeRatingText.indexOf(' ')));
        let descriptionDetails = routePage.getElementsByClassName('description-details')[0];
        let tableRows = descriptionDetails.getElementsByTagName('tbody')[0].children;
        let routeTypeString = tableRows[0].children[1].innerText;
        let routeType = routeTypeString.substring(0, routeTypeString.indexOf(','));
        let routeHeight = parseInt(routeTypeString.substring(routeTypeString.indexOf(' ') + 1, routeTypeString.indexOf('ft') - 1));
        let firstAscent = tableRows[1].children[1].innerText;

        // TODO: next add areas 

        return {
            routeName: routeName,
            routeGrade: routeGrade,
            routeRating: routeRating,
            routeType: routeType,
            routeHeight: routeHeight,
            firstAscent: firstAscent,
            areas: areas,
        };
    });

    console.log(routeDetails);
}

getRouteData(106702950);