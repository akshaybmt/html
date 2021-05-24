const puppeteer = require('puppeteer');
const xlsx = require("xlsx");



async function getPageData(url,page){
    await page.goto(url);

    const h1 = await page.$eval(".product_main h1", h1 => h1.textContent);
    const price = await page.$eval(".price_color", price => price.textContent);
    const instock = await page.$eval(".instock.availability", instock => instock.textContent);

    return{
        title: h1,
        price: price,
        instock: instock
    }

};

async function getLinks(){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('http://books.toscrape.com/');

    const links = await page.$$eval('.product_pod .image_container a', allAs => allAs.map(a => a.href));

    await browser.close();
    return links; 
}

async function main(){

    const allLinks = await getLinks();

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();




    
    const scrappedData = [];

    for(let link of allLinks){


        const data = await getPageData(link, page);
        scrappedData.push(data);

    }

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(scrappedData);
    xlsx.utils.book_append_sheet(wb,ws);
    xlsx.writeFile(wb,"links.xlsx");


    
    
}


main();
