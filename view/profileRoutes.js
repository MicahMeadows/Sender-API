const express = require('express');
const router = express.Router();
// const profileController = require('../controllers/profileController');

router.get('/routeFilters', (req, res) => {
    res.status(200).send({
        minGrade: '5.10a',
        maxGrade: '5.12a',
        showMultipitch: true
    });
});

router.post('/routeFilters', (req, res) => {
    res.status(200).send(`successfully submited filters: ${JSON.stringify(req.body)}`);
});

module.exports = router;