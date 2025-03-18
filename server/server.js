//server imports
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

//import helper methods
const { startCrawl} = require('../crawl.js')
const { summarize_report } = require('../summarize.js')
const { printContactData } = require('../report.js');


//initializing the server (http&ws)
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Server functions
async function handleMessage(mess, ws){
    try{
        const message = JSON.parse(mess);
        //sends a message to confirm request
        ws.send(JSON.stringify({"status": "processing"}));
        console.log(message.option)
        //scrapes the webpage
        const [pages, report] = await startCrawl(message.link, message.link, {}, []);
        ws.send(JSON.stringify({"status": "summary"}));
        console.log("Moving to the next step");

        //chooses the right response based on the user input
        if(message.option=="intelligent"){
            const final_report = await summarize_report(report, pages, message.gptkey);
            ws.send(JSON.stringify({
                "status": "done",
                "mode": "intelligent",
                "report": final_report
                }))
        }
        else if(message.option=="contact"){
            const contact = printContactData(pages);
            ws.send(JSON.stringify({
                "status": "done",
                "mode": "contact",
                "report": contact
                }))
        }
        else if(message.option=="structure"){
            ws.send(JSON.stringify({
                "status": "done",
                "mode": "structure",
                "report": pages
                }))
        }
        else if(message.option=="report"){
            //Calls OpenAI API to create a summary
            const summary = await summarize_report(report, pages, message.gptkey);
            const contact = printContactData(pages);
            const final_report = {
                "summary": summary,
                "contact": contact,
                "pages": pages
            }
            ws.send(JSON.stringify({
                "status": "done",
                "mode": "report",
                "report": final_report
                }))
        }
        else{
            console.log("Error - no valid option - fail silently")
            throw new Error("No valid option provided")
        }

    }
    catch(error){
        //normal messages
        console.log("Possible non json object - possible error in handleMessage")
    }
        

}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        //starts crawling the page and sends a response
        handleMessage(message, ws);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});