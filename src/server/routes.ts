import * as express from 'express';
const cheeses = require('./data/cheeses.json');
const router = express.Router();

// Used for storing cheeses on the server.
var recentCheeses:String[] = [];

// Adds cheeses to recentCheeses
const addCheeses = (cheeses:String) => {
    recentCheeses.push(cheeses);
}

router.get('/api/cheeses', (req, res, next) => {

    res.json(cheeses);
});

// Used to post cheeses from the front-end to the back-end
router.post('/api/recentPurchases', (req, res, next) => {

    addCheeses(req.body);

    res.status(200).send();
})

// Used to retrieve previously bought cheeses from the backend
router.get('/api/recentPurchases', (req, res, next) => {
    res.json(recentCheeses);
})

export default router;