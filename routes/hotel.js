// import fetch from "node-fetch";
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../Utility/catchAsync");
const hotel = require('../controllers/hotel')
const Campground = require('../models/campground');
const Booking = require('../models/booking');

router.route('/')
    .get(catchAsync(hotel.index))

router.route('/v2')
    .get(catchAsync(hotel.indexv2));

router.post('/checkBooking/:id', catchAsync(async (req, res, next) => {
    console.log(req.body.book)
    const id = req.params.id;
    const checkin = req.body.book.checkin;
    const checkout = req.body.book.checkout;
    const bnb = await Campground.findById(id)
    console.log(bnb)
    const forbiddenDates = bnb.unavailableDates
    const start = new Date(checkin);
    const end = new Date(checkout);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
        dates.push(new Date(date).getTime());
        date.setDate(date.getDate() + 1);
    }
    console.log(dates)

    const isFound = forbiddenDates.some((date) =>
        dates.includes(new Date(date).getTime())
    );
    console.log(isFound)
    if (!isFound) {
        const redirecturl = "/hotel/booking/" + id
        res.redirect(redirecturl);
    } else {
        req.flash('success', 'BnB not available for Booking for the given dates.')
        res.redirect(`/campgrounds/${id}`)
    }

}));

router.get('/booking/:id', catchAsync(async (req, res, next) => {

    const id = req.params.id;
    console.log(id)
    res.render('campgrounds/booking', { id });
}));



router.post('/postBooking/:id', catchAsync(async (req, res, next) => {
    console.log(req.body.book);
    console.log(req.user);
    const bnbid = req.params.id;
    const userid = req.user._id;
    const BookingName = req.body.book.name;
    const checkin = req.body.book.checkin;
    const checkout = req.body.book.checkout;
    const People = req.body.book.People;
    const Address = req.body.book.address;
    const Mobile = req.body.book.mobile;

    const booking = new Booking({
        userid, bnbid, BookingName, checkin, checkout, People,
        Address, Mobile
    })
    booking.save();
    const bnb = await Campground.findById(bnbid);

    const start = new Date(checkin);
    const end = new Date(checkout);
    const date = new Date(start.getTime());
    const dates = [];

    while (date <= end) {
        dates.push(new Date(date).getTime());
        date.setDate(date.getDate() + 1);
    }

    for (let i = 0; i < dates.length; i++) {
        bnb.unavailableDates.push(dates[i])
    }
    bnb.save();
    const redirecturl = "/campgrounds/" + bnbid
    res.redirect(redirecturl);
}))

router.get('/yourBookings', catchAsync(async (req, res, next) => {


    res.render('campgrounds/yourBooking');
}))
module.exports = router;