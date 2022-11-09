const mongoose = require('mongoose');
const Review = require('./review');
const Booking = require('./booking');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String,
})
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = {toJSON: {virtuals: true}};

const bnbSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    unavailableDates: [Number],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    Bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ]
    
}, opts);

bnbSchema.virtual('properties.popUpMarkUp').get(function() {
    return `
    <strong><a href="/bnbs/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
})

bnbSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Bnb', bnbSchema);