const mongoose = require('mongoose');
const vacationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A vacation must have a name'],
        unique: true
    },
    duration: {
        type: Number,
        required: [true, 'A vacation must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A vacation must have a group size']
    },
    type: {
        type: String,
        required: [true, 'A vacation must have a type']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A vacation must have a price']
    },
    description: {
        type: String,
        required: [true, 'A vacation must have a description']
    },
    imageCover: {
        type: String,
        required: [true, 'A vacation must have a cover image']
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
});

const Vacation = mongoose.model('Vacation', vacationSchema);
module.exports = Vacation;