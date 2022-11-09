const mongoose = require('mongoose');
const bnb = require('./bnb');
const User = require('./user');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
   userid:{
     type: Schema.Types.ObjectId,
     ref: 'User',
   },
   bnbid: {
    type: Schema.Types.ObjectId,
    ref: 'Bnb',
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