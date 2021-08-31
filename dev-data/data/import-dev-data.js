const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vacation = require('./../../models/vacationModel');


dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(() => console.log('DB connection successful'));

const vacations = JSON.parse(fs.readFileSync(`${__dirname}/vacations.json`,'utf-8'));



//IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Vacation.create(vacations);
        console.log('Data successfully loaded');
        process.exit();
    } catch (e) {
        console.log(e)
    }
};

// DELETE DATA FROM DB
const deleteData = async () => {
    try {
        await Vacation.deleteMany();
        console.log('Data deleted successfully!');
    } catch (e) {
        console.log(e)
    }
    process.exit();
};

if(process.argv[2] === '--import') {
    importData();
}
else if (process.argv[2] === '--delete') {
    deleteData();
}