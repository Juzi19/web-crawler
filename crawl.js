const {JSDOM} = require('jsdom')
const puppeteer = require('puppeteer')

async function crawlPage(baseURL, currentURL, pages){
    console.log(`actively crawling ${currentURL}`);

    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);
    if(baseURLObj.hostname!=currentURLObj.hostname){
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)
    if(pages[normalizedCurrentURL]>0){
        pages[normalizedCurrentURL]++;
        return pages
    }

    pages[normalizedCurrentURL] = 1;

    try{
        //launching puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const res = await page.goto(currentURL, { waitUntil: "networkidle2" }); 
        const htmlBody = await page.content();

        if(res.status()>399){
            console.log(`Error when fetching with status code: ${res.status()}`);
            return pages;
        }
        const headers = res.headers();
        const contentType = headers["content-type"] || "";
        if(!contentType.includes("text/html")){
            console.log("No html response.Instead: ", contentType);
            return pages;
        }
        //ends puppeteer session
        await browser.close();
        const nextURLs = getURLsFromHTML(htmlBody, baseURL);

        //recursive crawling
        for (const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL, pages);
        }
    }catch(err){
        console.log(`Error when fetching ${currentURL}. Exit with Error: ${err}`);
    }
    return pages
    
}

function normalizeURL(urlString){
    const urlObj = new URL(urlString);
    const hostpath = `${urlObj.hostname}${urlObj.pathname}`
    if(hostpath.length>0 && hostpath.slice(-1)=='/'){
        //everything except the last character
        return hostpath.slice(0, -1)
    }
    return hostpath
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkelements = dom.window.document.querySelectorAll('a');
    for(const linkElement of linkelements){
        if(linkElement.href.slice(0,1)==='/'){
            //relative url
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            } catch (err){
                console.log("error with invalid url", err)
            }
            
        } else {
            //absolute url
            try{
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            } catch (err){
                console.log("error with invalid url", err)
            }

        }
        
    }
    return urls
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}