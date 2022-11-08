const mongoose = require('mongoose');
const Campground = require('./campground');
const User = require('./user');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
   userid:{
     type: Schema.Types.ObjectId,
     ref: 'User',
   },
   bnbid: {
    type: Schema.Types.ObjectId,
    ref: 'Campground',
   },
   BookingName: String,
   checkin: Date,
   checkout: Date,
   People: Number,
   Address: String,
   Mobile: String,
   bill: Number,
});


module.exports = mongoose.model('Booking', bookingSchema);