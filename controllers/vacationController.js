const Vacation = require('./../models/vacationModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopVacations = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,type';
    next();
};







exports.getAllVacations = factory.getAll(Vacation);
exports.getVacation = factory.getOne(Vacation, {path: 'reviews'});
exports.createVacation = factory.createOne(Vacation);
exports.updateVacation = factory.updateOne(Vacation);
exports.deleteVacation = factory.deleteOne(Vacation);


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




exports.getVacationsWithin = catchAsync(async (req,res,next) => {
    const {distance, latlng, unit} = req.params;
    const [lat,lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat||!lng) {
        next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lng', 400
            )
        );
    }

    const vacations = await Vacation.find({ startLocation: { $geoWithin: {$centerSphere: [ [lng, lat], radius ]} }});

    res.status(200).json({
        status: 'success',
        results: vacations.length,
        data: {
            data: vacations
        }
    })
});


exports.getDistances = catchAsync( async (req,res,next) => {
    const { latlng, unit} = req.params;
    const [lat,lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat||!lng) {
        next(
            new AppError(
                'Please provide latitude and longitude in the format lat,lng', 400
            )
        );
    }

    const distances = await Vacation.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        }, {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    })
});