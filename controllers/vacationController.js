const Vacation = require('./../models/vacationModel');





exports.getAllVacations =  (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        // results: vacations.length,
        // data: {
        //     vacations
        // }
    })
};


exports.getVacation = (req, res) => {
    console.log(req.params);

    // const id = req.params.id * 1;
    // const vacation = vacations.find(el => el.id === id);
    //
    // res.status(200).json({
    //     status: "success",
    //     data: {
    //         vacation
    //     }
    // })
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


exports.updateVacation = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            vacation: '<Updated Tour here...>'
        }
    });
};


exports.deleteVacation = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    });
};