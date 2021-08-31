const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req,res,next) => {
    let filter = {};
    if (req.params.vacationId) filter = {tour: req.params.vacationId};

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
});

exports.createReview = catchAsync(async (req,res,next) => {
    // Allow nested routes
    if(!req.body.vacation) req.body.tour = req.params.vacationId;
    if(!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    })
});

exports.deleteReview = factory.deleteOne(Review);