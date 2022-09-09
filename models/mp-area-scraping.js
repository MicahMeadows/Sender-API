const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function getSubAreas(parentAreaId = 0) {
    const _baseUrl = 'https://www.mountainproject.com/ajax/public/area-picker-list';
    const res = await fetch(`${_baseUrl}/${parentAreaId}`);
    const html = await res.text();
    const $ = cheerio.load(html);

    const divs = $('div');
    
    const areas = [];
    divs.each((_, e) => {
        let aTag = $(e).find('a');
        let strongTag = $(e).find('strong');

        const id = strongTag != '' ? parentAreaId.trim() : aTag.attr('data-area-id').trim();
        const name = strongTag != '' ? strongTag.text().trim() : aTag.attr('data-area-title').trim();

        areas.push({
            id: id,
            name: name
        });
    });

    // String id
    // String name

    return areas;
};

// const KENTUCKY_ID = 105868674;

// getSubAreas(KENTUCKY_ID);

module.exports = { getSubAreas };