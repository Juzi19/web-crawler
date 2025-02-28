function sortPages(pages){
    const pagesArr = Object.entries(pages)
    pagesArr.sort((a,b)=>{
        aHits = a[1]
        bHits = b[1]
        return b[1]-a[1]
    })
    return pagesArr
}

function printReport(pages){
    console.log("=========")
    console.log("LINKS")
    console.log("=========")
    const sortedPages = sortPages(pages)
    for (const sp of sortedPages){
        const url = sp[0]
        const hits = sp[1]
        console.log(`Found ${hits} links to page${url}`)
    }
    console.log("=========")
    console.log("LINKS END")
    console.log("=========")
}

function printContactData(pages){
    const contact_links = []
    for(let page of Object.entries(pages)){
        let url = page[0]

        if (
            url.startsWith("mailto:") || 
            url.startsWith("tel:") || 
            url.includes("linkedin.com") || 
            url.includes("xing.com") || 
            url.includes("instagram.com") || 
            url.includes("facebook.com") || 
            url.includes("youtube.com") || 
            url.includes("x.com") || 
            url.includes("tiktok.com") || 
            url.includes("github.com") || 
            /contact|kontakt|legals|über-uns|ueber-uns|überuns|information|impressum|about|team/i.test(url) // checks for typical contact pages
        ) {
            if(url.startsWith("mailto:")){
                console.log("Email found:", url.slice(7))
            }
            else if(url.startsWith("tel:")){
                console.log("Phone number found:", url.slice(4))
            }
            else{
                url = url.replace(/([^:]\/)\/+/g, "$1")
                if(!url.startsWith('www')){
                    url = `www.${url}`;
                }
                console.log("Contact link found:", `${url}`);
            }
            contact_links.push(url);
        }
    }
    return contact_links;
}

module.exports = {
    printReport,
    sortPages,
    printContactData
}