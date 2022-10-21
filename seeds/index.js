const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/camping', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const seedDB = async () => {

    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1 =Math.floor(Math.random()*1000);
        const randprice = Math.floor(Math.random() *40) + 10;
        const placesrand = Math.floor(Math.random() *places.length);
        const desciptorsrand = Math.floor(Math.random() * descriptors.length);
        const newcamp = new Campground({
            author: '62f16308f755dc09ef7975d7' ,
            location: `${cities[random1].city}, ${cities[random1].state}`,
            title: `${descriptors[desciptorsrand]} ${places[placesrand]}`,
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum at ut praesentium cum perspiciatis animi beatae possimus veritatis sequi vitae, recusandae, aspernatur dolore, iusto omnis molestias non ipsam impedit?",
            price: randprice,
            geometry: { type: 'Point', coordinates: [ cities[random1].longitude, cities[random1].latitude ]},
            images: [
              {
                url: 'https://res.cloudinary.com/dvfo4sxo2/image/upload/v1660518314/Yelpcamp/ga8tx2bsovfwqriypfmb.jpg',
                filename: 'Yelpcamp/ga8tx2bsovfwqriypfmb',
               
              },
              {
                url: 'https://res.cloudinary.com/dvfo4sxo2/image/upload/v1660518315/Yelpcamp/ii60odvq7berrymwybzd.jpg',
                filename: 'Yelpcamp/ii60odvq7berrymwybzd',
              
              },
              {
                url: 'https://res.cloudinary.com/dvfo4sxo2/image/upload/v1660518317/Yelpcamp/njcklrw9h0e5gqiz2mnj.jpg',
                filename: 'Yelpcamp/njcklrw9h0e5gqiz2mnj',
               
              },
              {
                url: 'https://res.cloudinary.com/dvfo4sxo2/image/upload/v1660518321/Yelpcamp/qt8y0p8lydewpatb5s16.jpg',
                filename: 'Yelpcamp/qt8y0p8lydewpatb5s16',
               
              }
            ]

        })
        await newcamp.save();
    }
    
}

seedDB().then(() => {
    mongoose.connection.close();
});
