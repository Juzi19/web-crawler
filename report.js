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
    console.log("REPORT")
    console.log("=========")
    const sortedPages = sortPages(pages)
    for (const sp of sortedPages){
        const url = sp[0]
        const hits = sp[1]
        console.log(`Found ${hits} links to page${url}`)
    }
    console.log("=========")
    console.log("END")
    console.log("=========")
    
}

module.exports = {
    printReport,
    sortPages
}