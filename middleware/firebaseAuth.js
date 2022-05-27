const firebaseAdmin = require('firebase-admin');

function checkAuth(req, res, next) {
    if (req.headers.authtoken) {
        firebaseAdmin.auth().verifyIdToken(req.headers.authtoken)
            .then((decodedToken) => {
                req.uid = decodedToken.uid;
                next();
            }).catch(() => {
                res.status(403).send('Unauthorized');
            });
    } else {
        res.status(403).send('Unauthorized');
    }
}

module.exports = checkAuth;