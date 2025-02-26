const {JSDOM} = require('jsdom')

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
    getURLsFromHTML
}