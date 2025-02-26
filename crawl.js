const {JSDOM} = require('jsdom')

async function crawlPage(currentURL){
    console.log(`actively crawling ${currentURL}`);
    try{
        const res = await fetch(currentURL);
        if(res.status>399){
            console.log(`Error when fetching with status code: ${res.status}`)
            return
        }
        const contentType = res.headers.get('content-type')
        if(!contentType.includes("text/html")){
            console.log("No html response.Instead: ", contentType)
            return
        }
        const body = await res.text();
        console.log(body)
    }catch(err){
        console.log(`Error when fetching ${currentURL}. Exit with Error: ${err}`)
    }
    
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