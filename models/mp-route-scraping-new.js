const fetch = require('node-fetch');
const cheerio = require('cheerio');

function createMountainProjectUrl(routeId) {
    return `https://www.mountainproject.com/route/${routeId}`;
}

async function testImageUrl(url) {
    const res = await fetch(url, {
        method: 'HEAD',
    });
    const status = res.status;
    return status >= 200 && status < 300;
}

async function upscaleImage(imageUrl) {
    var firstUnderscore = imageUrl.indexOf('_');
    var restString = imageUrl.substring(firstUnderscore + 1);
    var imgSize = restString.substring(0, restString.indexOf('_'));

    var largeUrl = imageUrl.replace(imgSize, 'large');
    const largeUrlValid = await testImageUrl(largeUrl);
    if (largeUrlValid) return largeUrl;

    var mediumUrl = imageUrl.replace(imgSize, 'medium');
    const mediumUrlValid = await testImageUrl(mediumUrl);
    if (mediumUrlValid) return mediumUrl;

    var smallMedUrl = imageUrl.replace(imgSize, 'smallMed');
    const smallMedUrlValid = await testImageUrl(smallMedUrl);
    if (smallMedUrl) return smallMedUrl;

    var smallUrl = imageUrl.replace(imgSize, 'small');
    const smallUrlValid = await testImageUrl(smallUrl);
    if (smallUrl) return smallUrl;

    return imgSize;
}

async function getRouteData(routeIds) {
    const requests = routeIds.map(async id => {
        const url = createMountainProjectUrl(id);
        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);

        // const firstAscentTd = document.querySelector('.description-details > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)');
        const firstAscentTd = $('.description-details > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)').html();

        // const areaLinks = document.querySelector('div.col-md-9:nth-child(1) > div:nth-child(2)').children;
        const areaLinks = $('div.col-md-9:nth-child(1) > div:nth-child(2)').children();

        // const images = document.querySelectorAll('div.col-xs-4.col-lg-3.card-with-photo > a > div > img');
        const images = $('div.col-xs-4.col-lg-3.card-with-photo > a > div > img');

        // const moreDetailsSections = document.querySelectorAll('#route-page k> div > div.col-md-9.main-content.float-md-right > div.row > div.col-xs-12 > div.mt-2');
        const moreDetailsSections = $('#route-page > div > div.col-md-9.main-content.float-md-right > div.row > div.col-xs-12 > div.mt-2');

        var sectionsData = [];
        moreDetailsSections.each(function (index, element) {
            const children = $(element).children();
            sectionsData.push({
                title: $(children[1]).text().trim(),
                content: $(children[2]).text().trim(),
            });
        });

        let areas = Array.from(areaLinks).map(element => {
            let areaLinkText = $(element).attr('href');
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
                shortName: $(element).text(),
                name: areaNameWords.join(' '),
            };
        });

        var imageUrls;
        if (images != null) {
            imageUrls = await Promise.all(Array.from(images).map(async element => {
                try {
                    var imageUrl = $(element).attr('data-src');

                    return imageUrl;

                } catch (e) {
                    console.log(e);
                }
            }));
        }

        var upscaledImages = [];
        for (var image of imageUrls) {
            const upscaled = await upscaleImage(image);
            upscaledImages.push(upscaled);
        }

        const firstAscent = firstAscentTd.replace('\\n', '').trim();

        return {
            firstAscent: firstAscent,
            details: sectionsData,
            areas: areas.slice(1),
            imageUrls: upscaledImages,
            id: id,
        }
    });

    return Promise.all(requests);
}

module.exports = {
    getRouteData,
}