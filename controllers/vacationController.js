const Vacation = require('./../models/vacationModel');





exports.getAllVacations = async  (req, res) => {
    try {
        const vacations = await Vacation.find();
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
            message: "Invalid data sent!"
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