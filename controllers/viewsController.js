const Vacation = require('../models/vacationModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req,res, next) => {
    // 1) Get tour data from collection
    const vacations = await Vacation.find();

    // 2) Build template

    // 3) Render that template using vacation data from 1 Step 1
    res.status(200).render('overview', {
        title: 'All Vacations',
        vacations
    });
});

exports.getVacation = catchAsync(async (req,res) => {
    // 1) Get the data, for the requested tour (including reviews and guides)
    const vacation = await Vacation.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    // 2) Build template

    // 3) Render template using tour data from Step 1
    res.status(200).render('vacation', {
        title: 'Miami',
        vacation
    });
});