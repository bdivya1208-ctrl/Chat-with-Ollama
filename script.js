const chatBox = document.getElementById("chatBox");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("send");
const clearBtn = document.getElementById("clear");
const typing = document.getElementById("typing");
const modelSelect = document.getElementById("model");

let history = JSON.parse(localStorage.getItem("chatHistory")) || [];

/* ----------------------------
   Load Previous Chat
-----------------------------*/

window.onload = () => {

    if(history.length === 0)
        return;

    chatBox.innerHTML = "";

    history.forEach(msg => {

        if(msg.role === "user"){

            addUserMessage(msg.content);

        }else{

            addBotMessage(msg.content);

        }

    });

}

/* ----------------------------
   Save Chat
-----------------------------*/

function saveChat(){

    localStorage.setItem(
        "chatHistory",
        JSON.stringify(history)
    );

}

/* ----------------------------
   Auto Scroll
-----------------------------*/

function scrollBottom(){

    chatBox.scrollTop = chatBox.scrollHeight;

}

/* ----------------------------
   Auto Resize Textarea
-----------------------------*/

promptInput.addEventListener("input",()=>{

    promptInput.style.height="auto";

    promptInput.style.height=promptInput.scrollHeight+"px";

});

/* ----------------------------
   User Message
-----------------------------*/

function addBotMessage(text){

    const div=document.createElement("div");

    div.className="message bot";

    div.innerHTML=`

        <div class="bot-avatar">

            <i class="fa-solid fa-robot"></i>

        </div>

        <div class="bubble">

            ${text.replace(/\n/g,"<br>")}

        </div>

    `;

    chatBox.appendChild(div);

    scrollBottom();

}

/* ----------------------------
   Bot Message
-----------------------------*/

function addBotMessage(text){

    const div=document.createElement("div");

    div.className="message bot";

    div.innerHTML=`

        <img src="assets/bot-avatar.svg">

        <div class="bubble">

            ${text.replace(/\n/g,"<br>")}

        </div>

    `;

    chatBox.appendChild(div);

    scrollBottom();

}

/* ----------------------------
   Send Message
-----------------------------*/

async function sendMessage(){

    const prompt=promptInput.value.trim();

    if(prompt==="")
        return;

    if(document.querySelector(".welcome"))
        document.querySelector(".welcome").remove();

    addUserMessage(prompt);

    history.push({

        role:"user",

        content:prompt

    });

    saveChat();

    promptInput.value="";

    promptInput.style.height="auto";

    typing.classList.remove("hidden");

    try{

        const response=await fetch(
            "http://localhost:11434/api/chat",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    model:modelSelect.value,

                    messages:history,

                    stream:false

                })

            }

        );

        const data=await response.json();

        const reply=data.message.content;

        typing.classList.add("hidden");

        addBotMessage(reply);

        history.push({

            role:"assistant",

            content:reply

        });

        saveChat();

    }

    catch(err){

        typing.classList.add("hidden");

        addBotMessage(
            "❌ Unable to connect to Ollama."
        );

        console.error(err);

    }

}

/* ----------------------------
   Send Button
-----------------------------*/

sendBtn.addEventListener(

    "click",

    sendMessage

);

/* ----------------------------
   Enter to Send
-----------------------------*/

promptInput.addEventListener(

    "keydown",

    e=>{

        if(

            e.key==="Enter"

            &&

            !e.shiftKey

        ){

            e.preventDefault();

            sendMessage();

        }

    }

);

/* ----------------------------
   Clear Chat
-----------------------------*/

clearBtn.addEventListener(

    "click",

    ()=>{

        history=[];

        localStorage.removeItem("chatHistory");

      chatBox.innerHTML=`

<div class="welcome">

<div class="welcome-icon">

<i class="fa-solid fa-robot"></i>

</div>

<h1>Hello 👋</h1>

<p>

I'm your local AI assistant powered by Ollama.

Ask me anything.

</p>

</div>

`;
    }

);
