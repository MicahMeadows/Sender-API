const areaScraper = require('../business/mp-area-scraping');

var getAreasWithId = async (req, res) => {
    const { id } = req.params || 0;
    // const id = req.query.id || 0;
    console.log(`attemping to get areas for ${id}`);

    try {
        var subAreas = await areaScraper.getSubAreas(id);

        res.status(200).send(subAreas);
    } catch (e) {
        res.status(400).send(e);
    }
}

module.exports = { getAreasWithId }