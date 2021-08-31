const mongoose = require('mongoose');
const Vacation = require('./vacationModel');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty!']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        vacation: {
            type: mongoose.Schema.ObjectId,
            ref: 'Vacation',
            required: [true, 'Review must belong to a vacation.']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user.']
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });

    next();
});



reviewSchema.statics.calcAverageRatings = async function(vacationId) {
    const stats = await this.aggregate([
        {
            $match: {vacation: vacationId}
        },
        {
            $group: {
                _id: '$vacation',
                nRating: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ]);
    console.log(stats);

    if (stats.length > 0) {
        await Vacation.findByIdAndUpdate(vacationId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Vacation.findByIdAndUpdate(vacationId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

reviewSchema.post('save', function() {
    // this points to current review
    this.constructor.calcAverageRatings(this.vacation);
});



// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    console.log(this.r);
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    // await this.findOne(); does not work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.vacation);
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;