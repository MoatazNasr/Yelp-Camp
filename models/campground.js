const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const User = require('./user');

const opts = { toJSON: { virtuals:true }};

// made this to make virutals appear in a document even changing format to JSON

const campgroundSchema = new Schema({

    title: String,

    images: [{

        url: String,
        filename: String,

    }],

    geometry: {

        type: {
            type: String,

            enum: ["Point"],

            required: true
        },

        coordinates: {
            type: [Number],

            required: true
        }
    },

    price: {
        type: Number,
        max: 100,
    },
    location: String,
    description: String,

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },

    reviews: [{

        type: Schema.Types.ObjectId,

        ref: 'Review',
    }]

}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {

    return `<a href="/campground/${this._id}">${this.title}</a>
            <p>${this.description.substring(0,20)}...</p>
    `

})
// used when we do not want to save a specific thing in DB and want to to do a job
// virtual(name of the object will be used virtually ) function will do a job for this object(name)
// by default mongoose does not include virutal when convert a document to json

campgroundSchema.post('findOneAndDelete', async function (deletedCampgrond) {

    if (deletedCampgrond.reviews.length) {

        const result = await Review.deleteMany({ _id: { $in: deletedCampgrond.reviews } })

    }

})
// deletedCampground is a document (record) which get deleted from DB

module.exports = mongoose.model('Campground', campgroundSchema);