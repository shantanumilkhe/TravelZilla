const Bnb = require('../models/bnb');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary} = require('../cloudinary')
const Booking = require('../models/booking');



module.exports.index = async (req, res) => {
    const bnbs = await Bnb.find({});
    res.status(200).render('bnbs/index', { bnbs });
}

module.exports.newForm = (req, res) => {
    res.render('bnbs/new');
}

module.exports.createBnB = async (req, res, next) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.bnb.location,
        limit: 1
    }).send()
    const bnb = new Bnb(req.body.bnb);
    bnb.geometry = geodata.body.features[0].geometry;
    bnb.images = req.files.map(f => ({url: f.path, filename: f.filename }))
    bnb.author = req.user._id;
    await bnb.save();
    console.log(bnb)
    req.flash('success', 'Successfully created a new bnb')
    res.redirect(`/bnbs/${bnb._id}`)
}

module.exports.showbnb = async (req, res) => {
    const bnb = await Bnb.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author');
    
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy+ '-' + mm + '-' +dd ;
    if (!bnb) {
        req.flash('error', 'bnb not found');
        return res.status(500).send('bnb not found');
    }
    
    res.render('bnbs/show', { bnb, today });
}

module.exports.editbnb = async (req, res) => {

    const camp = await Bnb.findById(req.params.id);
    res.render('bnbs/edit', { camp });
}

module.exports.posteditbnb = async (req, res) => {
    const{id} = req.params;
    const bnb = await Bnb.findByIdAndUpdate(id, { ...req.body.bnb })
    const images = req.files.map(f => ({url: f.path, filename: f.filename }))
    bnb.images.push(...images)
    await bnb.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await bnb.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', `Successfully Edited bnb`)
    res.redirect(`/bnbs/${bnb._id}`)
}

module.exports.deletebnb = async (req, res) => {
    const { id } = req.params;
    await Bnb.findByIdAndDelete(id);
    res.redirect('/bnbs')
}

module.exports.checkbooking = async (req, res, next) => {
    console.log(req.body.book)
    const id = req.params.id;
    const checkin = req.body.book.checkin;
    const checkout = req.body.book.checkout;
    const bnb = await Bnb.findById(id)
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
        res.redirect(`/bnbs/${id}`)
    }

}

module.exports.renderBooking = async (req, res, next) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy+ '-' + mm + '-' +dd ;
    const id = req.params.id;
    const bnb = Bnb.findById(id);

    res.render('bnbs/booking', { id, today, bnb });
}

module.exports.confirmation = async (req, res, next) => {
    res.render('bnbs/confirmation')
}

module.exports.postBooking = async (req, res, next) => {
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
    
    const bnb = await Bnb.findById(bnbid);

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
}

module.exports.yourBookings  = async (req, res, next) => {

    const userid = req.user._id;
    const bnb = await Booking.find({userid: userid}).populate('bnbid')
    const bnbs = bnb.reverse();
    res.render('bnbs/yourBooking', {bnbs});
}

module.exports.recevied = async (req, res, next) => {

    const userid = req.user._id;
    const hostings = await Bnb.find({author: userid}).populate('Bookings')
    const booking = hostings.Bookings
   console.log(hostings);
const bnbs = [123]
    res.render('bnbs/receivedBookings', {hostings});
}

module.exports.deletebooking = async (req, res, next) => {
    const id = req.params.id;
    const books = await Booking.findById(id);
    const bnbId = books.bnbid;
    console.log(bnbId)
    const start = new Date(books.checkin);
    const end = new Date(books.checkout);
    const date = new Date(start.getTime());
    let dates = [];
   
    while (date <= end) {
        dates.push(new Date(date).getTime());
        date.setDate(date.getDate() + 1);
    }
  
    console.log(dates)
   
    for(let i = 0; i <dates.length; i++){
        console.log(dates[i])
        await Bnb.findByIdAndUpdate(bnbId, {$pull:{unavailableDates: parseInt(dates[i])}})

    }

    const book = await Booking.findByIdAndDelete(id);
    const redirecturl = '/hotel/yourBookings'
    res.redirect(redirecturl);
}