// import fetch from "node-fetch";
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../Utility/catchAsync");
const hotel = require('../controllers/hotel')
const BNB = require('../controllers/bnbs')
const Bnb = require('../models/bnb');
const Booking = require('../models/booking');
const booking = require('../models/booking');
const { isLoggedIN, validatebnb, isAuthor } = require('../middleware')

router.route('/')
    .get(catchAsync(hotel.index))


router.route('/v2')
    .get(isLoggedIN, catchAsync(hotel.indexv2));

router.get('/hotelsearch', catchAsync(hotel.search) )

router.post('/checkBooking/:id', catchAsync(BNB.checkbooking));

router.get('/booking/:id', isLoggedIN,catchAsync(BNB.renderBooking));

router.get('/bookingConfirmation', catchAsync(BNB.confirmation))

router.post('/postBooking/:id', catchAsync(BNB.postBooking))

router.get( '/yourBookings',isLoggedIN, catchAsync(BNB.yourBookings))

router.get( '/receivedBookings/',isLoggedIN, catchAsync(BNB.recevied))

router.delete('/deleteBooking/:id', catchAsync(BNB.deletebooking))

module.exports = router;