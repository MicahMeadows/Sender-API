const puppeteer = require('puppeteer');

module.exports.getSubAreas = getSubAreas

function parseLevelFromClass(classLevel) {
    let fixedLevel = classLevel.replace('l-', '');
    return parseInt(fixedLevel);
}

async function getSubAreas(parentAreaId = 0) {

    const subAreasRequestUrl = `https://www.mountainproject.com/ajax/public/area-picker-list/${parentAreaId}?mode=single&routes=0#`;


    let browser = await puppeteer.launch({
        headless: true,
        args: [
            "--disable-gpu",
            "--no-sandbox",
        ]
    });

    let page = await browser.newPage();

    await page.goto(subAreasRequestUrl, { waitUntil: 'networkidle2' });

    let selectedClassName = await page.$eval('div > strong', (area) => {
        return area.parentElement.className;
    });

    let parentLevel = parseLevelFromClass(selectedClassName);
    // console.log(`parent area level: ${parentLevel}`);


    let areaData = await page.$$eval('div > a', (links) => {
        let areas = [];
        links.forEach((link) => {
            let areaId = link.getAttribute('data-area-id');
            let areaTitle = link.getAttribute('data-area-title');
            let areaLevel = parseInt(link.parentElement.className.replace('l-', ''));

            let areaInfo = {
                "areaId": areaId,
                "areaTitle": areaTitle,
                "areaLevel": areaLevel
            };
            areas.push(areaInfo);
        });
        
        return areas;
    });

    const numResults = areaData.length;

    const lastArea = areaData[numResults-1];
    console.log(`last area level: ${lastArea.areaLevel}`);

    await browser.close();

    if (parentLevel == lastArea.areaLevel) {
        console.log('is leaf node');
        return [];
    } else {
        console.log(areaData);
        return areaData;
    }
};

// const KENTUCKY_ID = 105868674;

// getSubAreas(KENTUCKY_ID);