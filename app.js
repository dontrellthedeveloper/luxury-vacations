const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const vacations = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/vacation-simple-2.json`)
);

const getAllVacations =  (req, res) => {
    res.status(200).json({
        status: 'success',
        results: vacations.length,
        data: {
            vacations
        }
    })
};


const getVacation = (req, res) => {
    console.log(req.params);

    const id = req.params.id * 1;

    if(id > vacations.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    const vacation = vacations.find(el => el.id === id);

    res.status(200).json({
        status: "success",
        data: {
            vacation
        }
    })
};



const createVacation = (req, res) => {

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


const updateVacation = (req, res) => {
    if(req.params.id * 1 > vacations.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            vacation: '<Updated Tour here...>'
        }
    });
};


const deleteVacation = (req, res) => {
    if(req.params.id * 1 > vacations.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
};



// app.get('/api/v1/tours', getAllVacations);
// app.get('/api/v1/tours/:id', getVacation);
// app.post('/api/v1/tours', createVacation);
// app.patch('/api/v1/tours/:id', updateVacation);
// app.delete('/api/v1/tours/:id', deleteVacation);


app
    .route('/api/v1/vacations')
    .get(getAllVacations)
    .post(createVacation);

app
    .route('/api/v1/vacations/:id')
    .get(getVacation)
    .patch(updateVacation)
    .delete(deleteVacation);


const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});






