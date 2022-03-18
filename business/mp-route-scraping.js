
const puppeteer = require('puppeteer');

module.exports.getRouteData = getRouteData

async function getRouteData(routeId) {
    const routeRequestUrl = `https://www.mountainproject.com/route/${routeId}`;

    let browser = await puppeteer.launch({headless: true});

    let page = await browser.newPage();

    await page.goto(routeRequestUrl, { waitUntil: 'networkidle2' });

    let routeDetails = await page.evaluate(() => {
        const routeNameHeader = document.querySelector('#route-page > div > div.col-md-9.float-md-right.mb-1 > h1');
        const routeGradeSpan = document.querySelector('#route-page > div > div.col-md-9.float-md-right.mb-1 > h2 > span.rateYDS');
        const routeTypeTd = document.querySelector('#route-page > div > div.col-md-9.main-content.float-md-right > div.row > div.col-lg-7.col-md-6 > div.small.mb-1 > table > tbody > tr:nth-child(1) > td:nth-child(2)');
        const routeRatingSpan = document.querySelector('a.show-tooltip:nth-child(1)').children[0];
        const firstAscentTd = document.querySelector('.description-details > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)');
        const descriptionDiv = document.querySelector('div.mt-2:nth-child(1) > div:nth-child(3)');
        const protectionDiv = document.querySelector('div.max-height:nth-child(3) > div:nth-child(3)');
        const locationDiv = document.querySelector('div.max-height:nth-child(2) > div:nth-child(3)');
        const areaLinks = document.querySelector('div.col-md-9:nth-child(1) > div:nth-child(2)').children;
        const images = document.querySelectorAll('div.col-xs-4.col-lg-3.card-with-photo > a > div > img');

        let routeGradeTextFix = routeGradeSpan.innerText.split(' ')[0];

        let routeTypeTdText = routeTypeTd.innerText;
        let routeTypeTextFix = routeTypeTdText.substring(0, routeTypeTdText.indexOf(','));
        let routeHeightText = routeTypeTdText.replace(`${routeTypeTextFix}, `, '');
        routeHeightText = routeHeightText.substring(0, routeHeightText.indexOf(' '));
        let routeHeight = parseInt(routeHeightText);

        let routeRatingSpanText = routeRatingSpan.innerText;
        routeRatingSpanText = routeRatingSpanText.trimStart();
        routeRatingSpanText = routeRatingSpanText.replace('Avg: ', '');
        routeRatingSpanText = routeRatingSpanText.substring(0, routeRatingSpanText.indexOf(' '));
        let routeRating = parseFloat(routeRatingSpanText);

        let areas = Array.from(areaLinks).map(element => {
            let areaLinkText = element.getAttribute('href');
            areaLinkText = areaLinkText.substring(areaLinkText.indexOf('/area/'));
            let splitRemainder = areaLinkText.split('/');
            let areaId = splitRemainder[2];
            let areaName = splitRemainder[3];
            let areaNameWords = areaName.split('-');
            for (let i = 0; i < areaNameWords.length; i++) {
                areaNameWords[i] = areaNameWords[i][0].toUpperCase() + areaNameWords[i].substring(1).toLowerCase();
            }

            return {
                id: areaId,
                name: areaNameWords.join(' '),
            };
        });

        let imageUrls = Array.from(images).map(element => {
            return element.getAttribute('data-src').replace('smallMed', 'medium');
        });

        return {
            name: routeNameHeader.innerText,
            grade: routeGradeTextFix,
            type: routeTypeTextFix,
            rating: routeRating,
            height: routeHeight,
            firstAscent: firstAscentTd.innerText,
            description: descriptionDiv.innerText,
            protection: protectionDiv.innerText,
            location: locationDiv.innerText,
            areas: areas,
            imageUrls: imageUrls,
        };
    });

    browser.close();

    routeDetails["routeId"] = routeId;
    return routeDetails;
}

// async function main() {
//     // console.log(await getRouteData(118297380)); // Fugaku
//     console.log(await getRouteData(106702950)); // Different strokes
// }

// main();