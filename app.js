const puppeteer = require('puppeteer');
var cheerio =  require('cheerio');

console.log('Script started');

const options = {
    uri: 'https://max-try.ru/catalog/elektronika/',
    transform: (body) => cheerio.load(body),
    username: 'Vladislav747',
    password: 'Olaola74Las',
    maxPage: 100,
}

const login = async (page, options) => {
    const CREDS = {
        username: options.username,
        password: options.password,
    }

    const USERNAME_SELECTOR = '#user[login]';
    const PASSWORD_SELECTOR = '#user[password]';
    const BUTTON_SELECTOR = 'div.rounded-1.text-gray.bg-gray-light.py-4.px-4.px-md-3.px-lg-4 > form > button.btn-mktg';


    await page.goto('https://github.com/login');

    //dom element selectors
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);
    await page.click(BUTTON_SELECTOR);
    await page.waitForNavigation();
}

//Создать строку url
const getSearchUrl = (options) => {
    const searchText = options.search || 'john';
    return `https://github.com/search?q=${searchText}`;
}

//Получить количество товаров
const getNumGoods = async (page, options) => {
    const PARENT_TAG = '.catalog_block';
    const CHILDREN_TAG = '.item_block';


    let content = await page.content();
    let $ = options.transform(content);
    const num = parseInt($(PARENT_TAG).children(CHILDREN_TAG).length);
    
    console.log($(PARENT_TAG).children(CHILDREN_TAG).length,'num');
    
    return num > options.maxPage ? options.maxPage || 100 : num;
}

//
const receiveUserData = async (page, options) => {
    const PARENT_TAG = '.catalog_block';
    const CHILDREN_TAG = '.item_block';

    await page.goto(options.uri, {waitUntil: ['domcontentloaded']});

    let content = await page.content();
    let $ = options.transform(content);

    var data = [];

    $(PARENT_TAG + ' '+ CHILDREN_TAG).each(function(){
        data.push($(this).text().replace(' ','').trim());
    })

    console.log(data, 'data');

    return data;

}


const writeFileInterceptor = ({blacklist}) => (e) => {
    if(blacklist.find(item => item.test(e.url))){
        e.abort();
    }else{
        e.continue();
    }
}



const scrape = async (options) => {
    
    const browser = await puppeteer.launch(options);
    
    const page = await browser.newPage();

    //Only for screenshots
    // await page.setViewport({
    //     width: 1240,
    //     height: 680
    // });
    
    await page.goto(options.uri);
    //await login(page, options);
    const numPages = await getNumGoods(page, options);
    const data = await receiveUserData(page, options);

    await browser.close();
    
    return {numPages, data}
}

//console.log(scrape(options));

module.exports = scrape(options);