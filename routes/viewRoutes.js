const express = require('express');
const viewController = require('../controllers/viewsController');

const router = express.Router();


router.get('/', viewController.getOverview);
router.get('/vacation/:slug', viewController.getVacation);

module.exports = router;