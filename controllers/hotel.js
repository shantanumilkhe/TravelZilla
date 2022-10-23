
module.exports.index = async (req, res) => {
    const fetch = require('node-fetch');

    const url = 'https://travel-advisor.p.rapidapi.com/hotels/list?location_id=304554&adults=1&rooms=1&nights=2&offset=0&currency=INR&order=asc&limit=30&sort=recommended&lang=en_US';

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '85c44055c7mshdc84d5ea8f4bc8bp16f386jsn07be9d4a00c0',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
    };

    let hotels = {};
    await fetch(url, options)
        .then(res => res.json())
        .then(json => hotels = json.data)
        .catch(err => console.error('error:' + err));
    
    console.log(hotels);
    res.render('hotel',{hotels});
}