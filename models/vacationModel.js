const mongoose = require('mongoose');
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
module.exports = Vacation;