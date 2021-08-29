const express = require('express');
const morgan = require('morgan');

const app = express();



const vacationRouter = require('./routes/vacationRoutes');
const userRouter = require('./routes/userRoutes');



// 1. Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));


app.use((req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();
});


// 3. Routes

app.use('/api/v1/vacations', vacationRouter);
app.use('/api/v1/users', userRouter);



app.all('*', (req,res,next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    })
});



module.exports = app;






