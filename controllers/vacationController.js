const Vacation = require('./../models/vacationModel');

const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopVacations = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,type';
    next();
};



exports.getAllVacations = async  (req, res) => {
    try {
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
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};




exports.getVacation = async (req, res) => {
    try {
        const vacation = await Vacation.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                vacation
            }
        })
    } catch (e) {
        res.status(404).json({
            status: 'fail',
            message: e
        });
    }
};



exports.createVacation = async (req, res) => {

    try {
        const newVacation = await Vacation.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                vacation: newVacation
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'fail',
            message: e
        })
    }


};


exports.updateVacation = async (req, res) => {
    try {
        const vacation = await Vacation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                vacation
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};


exports.deleteVacation = async (req, res) => {
    try {
        await Vacation.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};


exports.getVacationStats = async (req, res) => {
    try {
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
    } catch (e) {
        res.status(404).json({
            status: 'fail',
            message: e
        });
    }
};


exports.getMonthlyPlan = async (req, res) => {
    try {
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
    } catch (e) {
        res.status(404).json({
            status: 'fail',
            message: e
        });
    }
};