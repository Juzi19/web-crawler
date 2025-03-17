const {crawlPage} = require('./crawl.js')
const {printReport, printContactData} = require('./report.js')
const { summarize_report } = require('./summarize.js')
require('dotenv').config();
const api_key = process.env.OPEN_AI;


async function main(){
    if(process.argv.length<4){
        console.log("no website provided")
        process.exit(1)
    }
    else if(process.argv.length>4){
        console.log("too many command line args")
        process.exit(1)
    }
    const baseURL = process.argv[2]
    const mode = process.argv[3]

    console.log(`starting crawl of ${baseURL}`)
    const [pages, report] = await crawlPage(baseURL, baseURL, {}, [])
    //determines which report will be printed based on user input
    if(mode=="full"){
        console.log("======= FULL REPORT =======")
        console.log("=== STARTING WITH LINKS ===")
        printReport(pages)
        console.log("============================")
        console.log("= CONTINUING PAGES DETAILS =")
        console.log("============================")
        console.log(JSON.stringify(report, null, 2));
        console.log("============================")
        console.log("=== END OF PAGES DETAILS ===")
        console.log("============================")
    }
    else if(mode=="intelligent"){
        const response = await summarize_report(report, pages, api_key)
        console.log(response)
    }
    else if(mode == "links"){
        printReport(pages);
    }
    else if(mode == "contact"){
        console.log("============================")
        console.log("===== CONTACT DETAILS ======")
        console.log("============================")
        printContactData(pages);
        console.log("============================")
        console.log("== END OF CONTACT DETAILS ==")
        console.log("============================")
    }
    else{
        console.log("============================")
        console.log("=== ! INVALID ARGUMENT ! ===")
        console.log("============================")
        console.log("== PRINTING LINKS INSTEAD ==")
        printReport(pages)
    }
    
    

    
}

main()