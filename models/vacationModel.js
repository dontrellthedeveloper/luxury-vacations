const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
const validator = require('validator');

const vacationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A vacation must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'a vacation name must have less or equal to 40 character'],
        minlength: [2, 'a vacation name must have more or equal to 5 character']
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
        required: [true, 'A vacation must have a type'],
        enum: {
            values: ['tropics','mountains','city','desert'],
            message: 'Type is either: tropics, mountains, city, or desert'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
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
    },
        startLocation: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

vacationSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});


// vacationSchema.pre('save', async function(next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next()
// });


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
    // console.log(docs);
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