const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');
dotenv.config({path: './config.env'});



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => console.log('DB connection successful'));

// console.log(process.env);

const vacationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A vacation must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'A vacationZ must have a price']
    }
});

const Vacation = mongoose.model('Vacation', vacationSchema);


const vacationTour = new Vacation ({
    name: 'The Park Camper 2',
    price: 997
});

vacationTour.save().then(doc => {
    console.log(doc);
}).catch(err => {
    console.log('ERROR :', err)
});


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});