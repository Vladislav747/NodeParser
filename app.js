const puppeteer = require('puppeteer');
var cheerio =  require('cheerio');

const options = {
    uri: `http://books.toscrape.com/`,
    transform: (body) => cheerio.load(body)
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

//Получить количество страниц
const getNumPages = (page, options) => {
    const NUM_USER_SELECTOR = '#js-pjax-container';

    let content = await page.content();
    let $ = options.transform(content);

    let inner = ($(NUM_USER_SELECTOR)
                .html() || '')
                .replace(',','')
                .replace('users','')
                .trim();
    const numUsers = parseInt(inner);

    let num = Math.ceil(numUsers/10);
    return num > options.maxPage ? options.maxPage || 100 : num;
}

//
const receiveUserMeta = async (index, page, options) => {
    const LENGTH_SELECTOR_CLASS = '.user-list-item';

    //поле username
    const LIST_USERNAME_SELECTOR = '.user-list-info.ml-2 > a';
    //поле email
    const LIST_EMAIL_SELECTOR = '.octicon.octicon-mail + a.muted-link';

    let pageUrl = getSearchUrl(options) + '&p=' + index;

    await page.goto(pageUrl, {waitUntil: ['domcontentloaded']});

    let content = await page.content();
    let $ = options.transform(content);

    return $(LENGTH_SELECTOR_CLASS).map(function(){
        return {
            username: $(this).find(LIST_USERNAME_SELECTOR).eq(0).text(),
            email: $(this).find(LIST_EMAIL_SELECTOR).eq(0).text()
        }
    }).get().filter(e => e.email);

}

const scrape = async () => {
    const options = {
        uri: `http://books.toscrape.com/`,
        transform: (body) => cheerio.load(body),
        username: 'Vladislav747',
        password: 'Olaola74Las'
    }
    const browser = await puppeteer.launch(options);
    
    const page = await browser.newPage();

    //Only for screenshots
    // await page.setViewport({
    //     width: 1240,
    //     height: 680
    // });

    await page.goto(options.uri);
    await login(page, options);
    console.log(login(page, options));
    let content = await page.content();
    //const numPages = await getNumPages(page, options);
    //console.log(numPages, "numPages");
    let $ = options.transform(content);
    await browser.close();
    return $;
}

console.log(scrape());

module.exports = (options) => scrape(options);