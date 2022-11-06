// // import fetch from "node-fetch";
const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../Utility/catchAsync");
const hotel = require('../controllers/hotel')
const Campground = require('../models/campground');
const Booking = require('../models/booking');

router.route('/')
    .get(catchAsync(hotel.index))

router.get('/booking/:id', catchAsync( async (req, res, next) =>{
    res.render('campgrounds/booking');
}))

router.get('/yourBookings', catchAsync(async (req, res, next) => {

   
    res.render('campgrounds/yourBooking');
}))

module.exports = router;