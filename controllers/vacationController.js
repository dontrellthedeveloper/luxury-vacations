const fs = require('fs');

const vacations = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/vacation-simple-2.json`)
);




exports.checkID = (req, res, next, val) => {
    console.log(`Vacation id is: ${val}`);
    if(req.params.id * 1 > vacations.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    next();
};


exports.checkBody = (req,res,next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        })
    }
    next();
};



exports.getAllVacations =  (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: vacations.length,
        data: {
            vacations
        }
    })
};


exports.getVacation = (req, res) => {
    console.log(req.params);

    const id = req.params.id * 1;
    const vacation = vacations.find(el => el.id === id);

    res.status(200).json({
        status: "success",
        data: {
            vacation
        }
    })
};



exports.createVacation = (req, res) => {

    const newId = vacations[vacations.length - 1].id + 1;
    const newVacation = Object.assign({id: newId}, req.body);

    vacations.push(newVacation);

    fs.writeFile(`${__dirname}/dev-data/data/vacation-simple-2.json`, JSON.stringify(vacations), err => {
        res.status(201).json({
            status: 'success',
            results: vacations.length,
            data: {
                vacation: newVacation
            }
        })
    });
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