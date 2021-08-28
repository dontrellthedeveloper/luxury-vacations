const express = require('express');
const morgan = require('morgan');

const app = express();



const vacationRouter = require('./routes/vacationRoutes');
const userRouter = require('./routes/userRoutes');



// 1. Middleware
app.use(morgan('dev'));

app.use(express.json());


app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();
});


// 3. Routes

app.use('/api/v1/vacations', vacationRouter);
app.use('/api/v1/users', userRouter);


module.exports = app;






