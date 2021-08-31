const express = require('express');
const vacationController = require('./../controllers/vacationController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', vacationController.checkID);

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect, authController
//     .restrictTo('user'), reviewController.createReview
//   );
router.use('/:vacationId/reviews', reviewRouter);

router
    .route('/top-5-cheap')
    .get(vacationController.aliasTopVacations, vacationController.getAllVacations);

router.route('/tour-stats').get(vacationController.getVacationStats);
router
    .route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin','lead-guide', 'guide'),
        vacationController.getMonthlyPlan);

router
    .route('/')
    // .get(vacationController.getAllVacations)
    .get(vacationController.getAllVacations)
    .post(
        authController.protect,
        authController.restrictTo('admin','lead-guide'),
        vacationController.createVacation
    );

router
    .route('/:id')
    .get(vacationController.getVacation)
    .patch(
        authController.protect,
        authController.restrictTo('admin','lead-guide'),
        vacationController.updateVacation
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        vacationController.deleteVacation);

// router
//     .route('/:vacationId/reviews')
//     .post(authController.protect, authController
//         .restrictTo('user'), reviewController.createReview
//     );

module.exports = router;