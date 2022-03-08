const puppeteer = require('puppeteer');

function parseLevelFromClass(classLevel) {
    let fixedLevel = classLevel.replace('l-', '');
    return parseInt(fixedLevel);
}

async function getSubAreas(parentAreaId = 0) {

    const subAreasRequestUrl = `https://www.mountainproject.com/ajax/public/area-picker-list/${parentAreaId}?mode=single&routes=0#`;

    let browser = await puppeteer.launch({headless: false});

    let page = await browser.newPage();
    page.addScriptTag({ content: `${parseLevelFromClass} `});

    await page.goto(subAreasRequestUrl, { waitUntil: 'networkidle2' });

    let selectedClassName = await page.$eval('div > strong', (area) => {
        return area.parentElement.className;
    });

    let selectedLevel = parseLevelFromClass(selectedClassName);

    let areaData = await page.$$eval('div > a', (links) => {
        let areas = [];
        links.forEach((link) => {
            let areaId = link.getAttribute('data-area-id');
            let areaTitle = link.getAttribute('data-area-title');
            // let areaLevel = parseInt(link.parentElement.className.replace('l-', ''));
            let areaLevel = parseLevelFromClass(link.parentElement.className);

            let areaInfo = {
                "areaId": areaId,
                "areaTitle": areaTitle,
                "areaLevel": areaLevel
            };
            areas.push(areaInfo);
        });
        
        return areas;
    });

    console.log(areaData);


    await browser.close();
};


getSubAreas(122025889);