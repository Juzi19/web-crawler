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
    for(let page of Object.entries(pages)){
        let url = page[0]

        if (
            url.startsWith("mailto:") || 
            url.startsWith("tel:") || 
            url.includes("linkedin.com") || 
            url.includes("xing.com") || 
            url.includes("github.com") || 
            /contact|kontakt|impressum|about|team/i.test(url) // Sucht nach typischen Kontaktseiten
        ) {
            console.log("Kontakt-Link gefunden:", url);
        }
    }
}

module.exports = {
    printReport,
    sortPages,
    printContactData
}