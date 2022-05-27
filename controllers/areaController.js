const areaScraper = require('../models/mp-area-scraping');

async function updateAreasInDatabase(firestore, parentId, areas) {
    try {
        const batch = firestore.batch();

        const areasCollection = firestore.collection('areas');
        areas.forEach((area) => {
            const areaRef = areasCollection.doc(area.areaId);
            batch.set(areaRef, {
                name: area.areaTitle,
                parentId: parentId,
            });
        });
        await batch.commit();


    } catch (ex) {
        console.log(ex);

    }
}

var getAreasWithId = async (req, res) => {
    const { id } = req.params || 0;
    console.log(`attemping to get areas for ${id}`);

    try {
        var subAreas = await areaScraper.getSubAreas(id);
        const firestore = req.service.firestore;

        updateAreasInDatabase(firestore, id, subAreas);


        res.status(200).send(subAreas);
    } catch (e) {
        res.status(400).send(e);
    }
}

module.exports = { getAreasWithId }