const Bnb = require('../models/bnb');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const {cloudinary} = require('../cloudinary')

module.exports.index = async (req, res) => {
    const bnbs = await Bnb.find({});
    res.render('bnbs/index', { bnbs });
}

module.exports.newForm = (req, res) => {
    res.render('bnbs/new');
}

module.exports.createForm = async (req, res, next) => {
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
console.log(today)
    if (!bnb) {
        req.flash('error', 'bnb not found');
        return res.redirect('/bnbs');
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