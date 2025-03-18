const socket = new WebSocket('ws://localhost:3002');
const apiKey_input = document.getElementById("gpt-key");
const label = document.getElementById("l-gpt-key");
const selection = document.getElementById("mode");
const form = document.getElementById("form");
const circle = document.getElementById("progress-circle");
const progresstext = document.getElementById("progress-text");
const progressbox = document.getElementById("scraping-progress");
const resultsbox = document.getElementById("results_box");
const scraping_mode = document.getElementById("scraping_mode");
const scraping_results = document.getElementById("scraping_results");

socket.addEventListener('open', function (event) {
    console.log('Connected to the WebSocket server');
    socket.send('Hello Server!');
});

socket.addEventListener('message', function (event) {
    checkmessage(event.data)
    console.log('Message from server ', event.data);
});

socket.addEventListener('close', function (event) {
    console.log('Disconnected from the WebSocket server');
});

socket.addEventListener('error', function (event) {
    console.error('WebSocket error: ', event);
});

function display_text(object){
    //formats the text to a nice layout
    console.log(object)
    switch (object.mode){
        case "intelligent":
            scraping_results.innerHTML = `<h3 class='font-bold mt-3'>Linking structure</h3><p>${object.report.linking_structure}</p><h3 class='font-bold'>Content</h3><p>${object.report.content}</p><h3 class='font-bold'>Contact</h3><p>${object.report.contact}</p>`
            break;
        case "contact":
            //checks for contact info
            if(object.report.contact==[]){
                html = html + 'No contact data found!'
            }
            //creates a list
            let html = '<ul>'
            for(let c of Object.keys(object.report)){
                html = html + `<li>${c}</li>`
            }
            html = html + '</ul>';
            console.log(html);
            scraping_results.innerHTML =html;
            break;
        case "structure":
            let HTML = '<ul class="list-disc">'
            for(let c of Object.keys(object.report)){
                HTML = HTML + `<li>${c}, mentioned ${object.report[c]} times</li>`
            }
            HTML = HTML + '</ul>';
            console.log(HTML);
            scraping_results.innerHTML = HTML;
            break;
        case "report":
            let Html = `<h3 class='font-bold'>Linking structure</h3><p>${object.report.summary.linking_structure}</p><h3 class='font-bold'>Content</h3><p>${object.report.summary.content}</p><h3 class='font-bold'>Contact</h3><p>${object.report.summary.contact}</p>`
            Html = Html + '<h2 class="font-bold">Contact:</h2><ul>';
            if(object.report.contact==[]){
                Html = Html + 'No contact data found!'
            }
            for(let c of Object.keys(object.report.contact)){
                Html = Html + `<li>${c}</li>`
            }
            Html = Html + '</ul><h2 class="font-bold">Linking Structure</h2><ul>';
            for(let c of Object.keys(object.report.pages)){
                Html = Html + `<li>${c}, mentioned ${object.report.pages[c]} times</li>`
            }
            Html = Html + '</ul>';
            scraping_results.innerHTML =Html;
            break;

    }
}

function checkmessage(mes){
    try{
        const message =JSON.parse(mes);
        //change progressbar accordingly to the websocket message
        if(message.status=="processing"){
            setProgress(33)
            progresstext.innerText = 'Scraping the page';
        }
        else if(message.status=="summary"){
            setProgress(75);
            progresstext.innerText = 'Creating the report';
        }
        else if(message.status=="done"){
            //backend finished and sent data
            setProgress(100);
            progresstext.innerText = 'Finished';
            display_text(message);
            setTimeout(()=>{
                progressbox.style.display = 'none';
                resultsbox.style.display = 'block';
            },3000);
            
        }
        else{
            setProgress(0);
        }

    }
    catch(error){
        //message is not a json
        console.log("Not-json message received")
    }
}


//DOM manipulation

if(selection) checkforgptkey(selection.value);

function check_values(value){
    if(value == 'intelligent' || value == 'report'){
        apiKey_input.style.display = "block";
        label.style.display = "block";
        apiKey_input.required = true;
    }
    else{
        apiKey_input.style.display = "none";
        label.style.display = "none";
    }
}

function checkforgptkey(e){
    if(e.target){
        check_values(e.target.value)
    }
    else{
        check_values(e)
    }
    
}

//Progress bar animation
function setProgress(percent) {
    // Convert percent to stroke-dashoffset
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    // Apply styles
    circle.style.strokeDashoffset = offset;
}

//Form submission
function handleSubmit(e){
    //prevents form from sending data automatically
    e.preventDefault();
    const formData = new FormData(form);
    //Displays,update the progress form's headline
    progressbox.style.display = 'block';
    form.style.display = 'none';
    scraping_mode.innerText = `Results ${formData.get("mode")}`;
    //sends result to the server
    socket.send(JSON.stringify({"link": formData.get("link"), "gptkey": formData.get("gpt-key")??'', "option": formData.get("mode")}))
}


selection.addEventListener('change',checkforgptkey);
form.addEventListener('submit', handleSubmit);
