// import fetch from "node-fetch";
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router({ mergeParams: true });
const catchAsync = require("../Utility/catchAsync");
const hotel = require('../controllers/hotel')
const Campground = require('../models/campground');
const Booking = require('../models/booking');
const booking = require('../models/booking');
const { isLoggedIN, validatecampground, isAuthor } = require('../middleware')

router.route('/')
    .get(catchAsync(hotel.index))

router.route('/v2')
    .get(isLoggedIN, catchAsync(hotel.indexv2));

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

router.get('/booking/:id', isLoggedIN,catchAsync(async (req, res, next) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy+ '-' + mm + '-' +dd ;
    const id = req.params.id;
    const bnb = Campground.findById(id);

    res.render('campgrounds/booking', { id, today, bnb });
}));

router.get('/bookingConfirmation', catchAsync(async (req, res, next) => {
    res.render('campgrounds/confirmation')
}))

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
    
    const bnb = await Campground.findById(bnbid);

    const start = new Date(checkin);
    const end = new Date(checkout);
    const date = new Date(start.getTime());
    const dates = [];
    let totalDays = 0
    while (date <= end) {
        dates.push(new Date(date).getTime());
        date.setDate(date.getDate() + 1);
        totalDays += 1;
    }

    for (let i = 0; i < dates.length; i++) {
        bnb.unavailableDates.push(dates[i])
    }
    const price = bnb.price;
    let bill = totalDays*price
    booking.bill = bill

    booking.save();
    bnb.Bookings.push(booking.id);

    bnb.save();
    const redirecturl = '/hotel/yourBookings'
    res.redirect(redirecturl);
}))

router.get( '/yourBookings',isLoggedIN, catchAsync(async (req, res, next) => {

    const userid = req.user._id;
    const bnb = await booking.find({userid: userid}).populate('bnbid')

    const bnbs = bnb.reverse();
    res.render('campgrounds/yourBooking', {bnbs});
}))

router.get( '/receivedBookings/',isLoggedIN, catchAsync(async (req, res, next) => {

    const userid = req.user._id;
    const hostings = await Campground.find({author: userid}).populate('Bookings')
    const booking = hostings.Bookings
   console.log(hostings);
const bnbs = [123]
    res.render('campgrounds/receivedBookings', {hostings});
}))


router.delete('/deleteBooking/:id', catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const books = await booking.findById(id);
    const bnbId = books.bnbid;

    const start = new Date(books.checkin);
    const end = new Date(books.checkout);
    const date = new Date(start.getTime());
    let dates = [];
   
    while (date <= end) {
        dates.push(new Date(date).getTime());
        date.setDate(date.getDate() + 1);
    }
   
    for(let daten in dates){
        await Campground.findByIdAndUpdate(bnbId, {$pull:{unavailableDates: parseInt(daten)}})
    }

    const book = await booking.findByIdAndDelete(id);
    const redirecturl = '/hotel/yourBookings'
    res.redirect(redirecturl);
}))

module.exports = router;