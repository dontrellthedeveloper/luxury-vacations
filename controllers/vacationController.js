const Vacation = require('./../models/vacationModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopVacations = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,type';
    next();
};



exports.getAllVacations = catchAsync(async  (req, res, next) => {
        // EXECUTE QUERY
        const features = new APIFeatures(Vacation.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const vacations = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: vacations.length,
            data: {
                vacations
            }
        });
});




exports.getVacation = catchAsync(async (req, res, next) => {
        const vacation = await Vacation.findById(req.params.id).populate('reviews');

        if (!vacation) {
            return next(new AppError('No vacation found with that ID', 404))
        }

        res.status(200).json({
            status: "success",
            data: {
                vacation
            }
        })
});



exports.createVacation = catchAsync(async (req, res, next) => {


        const newVacation = await Vacation.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                vacation: newVacation
            }
        })
});


exports.updateVacation = catchAsync(async (req, res, next) => {

        const vacation = await Vacation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!vacation) {
            return next(new AppError('No vacation found with that ID', 404))
        }

        res.status(200).json({
            status: 'success',
            data: {
                vacation
            }
        });
});


exports.deleteVacation = catchAsync(async (req, res, next) => {

        const vacation = await Vacation.findByIdAndDelete(req.params.id);

        if (!vacation) {
            return next(new AppError('No vacation found with that ID', 404))
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
});


exports.getVacationStats = catchAsync(async (req, res, next) => {
        const stats = await Vacation.aggregate([
            {
                $match: {ratingsAverage: {$gte: 4.5}},
            },
            {
                $group: {
                    // _id: null,
                    _id: '$type',
                    numTours: {$sum: 1},
                    numRatings: {$sum: '$ratingsQuantity'},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {avgPrice: 1}
            }
            // {
            //     $match: {_id: {$ne: 'city'}}
            // }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
});


exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
        const year = req.params.year * 1;

        const plan = await Vacation.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {$month: '$startDates'},
                    numTourStarts: {$sum: 1},
                    tours: {$push: '$name'}
                }
            },
            {
                $addFields: {month: '$_id'}
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: {numTourStarts: -1}
            },
            {
                $limit: 12
            }
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
});