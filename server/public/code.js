const socket = new WebSocket('ws://localhost:3002');
const apiKey_input = document.getElementById("gpt-key");
const label = document.getElementById("l-gpt-key");
const selection = document.getElementById("mode");
const form = document.getElementById("form");
const circle = document.getElementById("progress-circle");
const progresstext = document.getElementById("progress-text");

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
            setProgress(100);
            progresstext.innerText = 'Finished';
            setTimeout(()=>{
                progresstext.innerText = 'Results';
            },5000);
            
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
    //sends result to the server
    socket.send(JSON.stringify({"link": formData.get("link"), "gptkey": formData.get("gpt-key")??'', "option": formData.get("mode")}))
}


selection.addEventListener('change',checkforgptkey);
form.addEventListener('submit', handleSubmit);
