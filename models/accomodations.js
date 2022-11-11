const mongoose = require('mongoose');
const Bnb = require('./bnb');
const Schema = mongoose.Schema;

const accomodationsSchema = new Schema({
   adults: Number,
   childern: Number,
   beds: Number,
   ammenities: String
});


module.exports = mongoose.model('Accomodations', accomodationsSchema);