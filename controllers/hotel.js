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
    const fetch = require('node-fetch');


}

module.exports.search = async(req,res,next) =>{
    const search = req.query.location;
    
    const fetch = require('node-fetch');

const url = 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query='+req.query.location;

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '3c9feac990mshb0f5dbb5fedd75cp1b9986jsn5784eb02628a',
    'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
  }
};

let searchResults = [];

await fetch(url, options)
	.then(res => res.json())
	.then(json => {console.log(json.data);searchResults = json.data})
	.catch(err => console.error('error:' + err));
    console.log(searchResults)
   
    
    const urls = 'https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchHotels?geoId='+geoIds+'&checkIn=2022-11-12&checkOut=2022-11-13&pageNumber=1&currencyCode=INR';

    const optionss = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '3c9feac990mshb0f5dbb5fedd75cp1b9986jsn5784eb02628a',
    'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
      }
    };
    let hotelsv2 = {};
    await fetch(urls, optionss)
        .then(res => res.json())
        .then(json => hotelsv2 = json.data)
        .catch(err => console.error('error:' + err));
    ;
        res.render('hotel/indexv2',{hotelsv2});
}