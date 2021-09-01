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

exports.getVacation = (req,res, next) => {
    res.status(200).render('vacation', {
        title: 'Miami'
    });
};