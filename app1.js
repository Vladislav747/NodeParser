var request = require('request-promise');
var cheerio =  require('cheerio');

//Аргументы для запроса
const options = {
    uri: "https://www.google.com",
    transform: (body) => cheerio.load(body),
}

//Самый примитивный парсер
const scrape = async (options) => {
    return await request(options);
}

scrape({...options}).then((result)=>{console.log(result.xml())});

var check =(params) => scrape({...options})

module.exports = check ;