const socket = new WebSocket('ws://localhost:3002');
const apiKey_input = document.getElementById("gpt-key");
const label = document.getElementById("l-gpt-key");
const selection = document.getElementById("mode");
const form = document.getElementById("form");

socket.addEventListener('open', function (event) {
    console.log('Connected to the WebSocket server');
    socket.send('Hello Server!');
});

socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

socket.addEventListener('close', function (event) {
    console.log('Disconnected from the WebSocket server');
});

socket.addEventListener('error', function (event) {
    console.error('WebSocket error: ', event);
});


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

function handleSubmit(e){
    //prevents form from sending data automatically
    e.preventDefault();
    const formData = new FormData(form);
    //sends result to the server
    socket.send(JSON.stringify({"link": formData.get("link"), "gptkey": formData.get("gpt-key")??'', "option": formData.get("mode")}))
}


selection.addEventListener('change',checkforgptkey);
form.addEventListener('submit', handleSubmit)