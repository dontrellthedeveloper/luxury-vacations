const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1. Middleware
app.use(morgan('dev'));

app.use(express.json());




app.use((req,res,next) => {
    console.log('Hello from the middleware');
    next();
});

app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();
});


const vacations = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/vacation-simple-2.json`)
);




// 2. Route Handlers

const getAllVacations =  (req, res) => {
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




const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
};

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    })
};









// 3. Routes

// app.get('/api/v1/tours', getAllVacations);
// app.get('/api/v1/tours/:id', getVacation);
// app.post('/api/v1/tours', createVacation);
// app.patch('/api/v1/tours/:id', updateVacation);
// app.delete('/api/v1/tours/:id', deleteVacation);


const vacationRouter = express.Router();
const userRouter = express.Router();

vacationRouter
    .route('/')
    .get(getAllVacations)
    .post(createVacation);

vacationRouter
    .route('/:id')
    .get(getVacation)
    .patch(updateVacation)
    .delete(deleteVacation);



userRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser);

userRouter
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);



app.use('/api/v1/vacations', vacationRouter);
app.use('/api/v1/users', userRouter);



// 4. Start Server

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});






