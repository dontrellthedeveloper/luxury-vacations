const mongoose = require('mongoose');
const slugify = require('slugify');

const vacationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A vacation must have a name'],
        unique: true
    },
    slug: String,
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
    },
    secretTour: {
        type: Boolean,
        default: false
    }
    },{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

vacationSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE runs before .save() and .create()
vacationSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next()
});

// QUERY MIDDLEWARE
vacationSchema.pre(/^find/, function(next) {
    this.find({secretTour: {$ne: true}});
    this.start = Date.now();
    next();
});

vacationSchema.post(/^find/, function(docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    console.log(docs);
    next();
});

// AGGREGATION MIDDLEWARE
vacationSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}});

    console.log(this.pipeline());
    next();
});


const Vacation = mongoose.model('Vacation', vacationSchema);

module.exports = Vacation;