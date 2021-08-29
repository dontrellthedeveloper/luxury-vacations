const Vacation = require('./../models/vacationModel');





exports.getAllVacations = async  (req, res) => {
    try {
        // BUILD QUERY
        // 1A) Filtering
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryStr));

        let query = Vacation.find(JSON.parse(queryStr));

        // 2) Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            console.log(sortBy);
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // 3) Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-_v');
        }

        // EXECUTE QUERY
        const vacations = await query;

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