const express = require('express');
const tourController = require('./../controllers/vacationController');

const router = express.Router();

router
    .route('/')
    .get(tourController.getAllVacations)
    .post(tourController.createVacation);

router
    .route('/:id')
    .get(tourController.getVacation)
    .patch(tourController.updateVacation)
    .delete(tourController.deleteVacation);

module.exports = router;