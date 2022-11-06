const fs = require('fs')
module.exports.index = async (req, res) => {
    // const fetch = require('node-fetch');

    // const url = 'https://travel-advisor.p.rapidapi.com/hotels/list?location_id=304554&adults=1&rooms=1&nights=2&offset=0&currency=INR&order=asc&limit=30&sort=recommended&lang=en_US';

    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Key': '85c44055c7mshdc84d5ea8f4bc8bp16f386jsn07be9d4a00c0',
    //         'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    //     }
    // };

    // let hotels = {};
    // await fetch(url, options)
    //     .then(res => res.json())
    //     .then(json => hotels = json.data)
    //     .catch(err => console.error('error:' + err));
    
    let hotels = {};
    await fs.readFile('file.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
        hotels = JSON.parse(data); //now it an object
        res.render('hotel/index',{hotels});
    }});
    
}

module.exports.indexv2 = async (req, res) => {
//     const fetch = require('node-fetch');

// const url = 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?geoId=304554&checkIn=2022-10-31&checkOut=2022-11-01&pageNumber=1&currencyCode=INR';

// const options = {
//   method: 'GET',
//   headers: {
//     'X-RapidAPI-Key': '0f948ff13emsh66b8bd5a711742cp1a5099jsnfa4b98f281be',
//     'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
//   }
// };
// let hotelsv2 = {};
// await fetch(url, options)
// 	.then(res => res.json())
// 	.then(json => hotelsv2 = json.data)
// 	.catch(err => console.error('error:' + err));
let hotelsv2 = {};
await fs.readFile('file1.json', 'utf8', function readFileCallback(err, data){
if (err){
    console.log(err);
} else {
    hotelsv2 = JSON.parse(data); //now it an object
    res.render('hotel/indexv2',{hotelsv2});
}});
    // res.render('hotel/indexv2',{hotelsv2});
}