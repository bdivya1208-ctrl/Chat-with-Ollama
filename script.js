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
document.addEventListener("DOMContentLoaded", () => {
    if (history.length === 0) return;

    chatBox.innerHTML = "";

    history.forEach(msg => {
        if (msg.role === "user") {
            addUserMessage(msg.content);
        } else {
            addBotMessage(msg.content);
        }
    });
});

/* ----------------------------
   Save Chat
-----------------------------*/
function saveChat() {
    localStorage.setItem("chatHistory", JSON.stringify(history));
}

/* ----------------------------
   Auto Scroll
-----------------------------*/
function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ----------------------------
   Auto Resize Textarea
-----------------------------*/
promptInput.addEventListener("input", () => {
    promptInput.style.height = "auto";
    promptInput.style.height = promptInput.scrollHeight + "px";
});

/* ----------------------------
   User Message
-----------------------------*/
function addUserMessage(text) {
    const div = document.createElement("div");
    div.className = "message user";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    div.appendChild(bubble);
    chatBox.appendChild(div);

    scrollBottom();
}

/* ----------------------------
   Bot Message
-----------------------------*/
function addBotMessage(text) {
    const div = document.createElement("div");
    div.className = "message bot";

    const avatar = document.createElement("div");
    avatar.className = "bot-avatar";
    avatar.innerHTML = `<i class="fa-solid fa-robot"></i>`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    // Preserve line breaks safely
    text.split("\n").forEach((line, index) => {
        bubble.appendChild(document.createTextNode(line));
        if (index < text.split("\n").length - 1) {
            bubble.appendChild(document.createElement("br"));
        }
    });

    div.appendChild(avatar);
    div.appendChild(bubble);

    chatBox.appendChild(div);

    scrollBottom();
}

/* ----------------------------
   Send Message
-----------------------------*/
async function sendMessage() {

    const prompt = promptInput.value.trim();

    if (prompt === "") return;

    if (document.querySelector(".welcome")) {
        document.querySelector(".welcome").remove();
    }

    addUserMessage(prompt);

    history.push({
        role: "user",
        content: prompt
    });

    saveChat();

    promptInput.value = "";
    promptInput.style.height = "auto";

    typing.classList.remove("hidden");

    sendBtn.disabled = true;

    try {

        const response = await fetch("http://localhost:11434/api/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                model: modelSelect.value,

                messages: history,

                stream: false

            })

        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();

        const reply =
            data.message?.content ||
            "No response received.";

        addBotMessage(reply);

        history.push({

            role: "assistant",

            content: reply

        });

        saveChat();

    } catch (err) {

        console.error(err);

        addBotMessage("❌ Unable to connect to Ollama. Make sure Ollama is running and the selected model is installed.");

    } finally {

        typing.classList.add("hidden");

        sendBtn.disabled = false;

        promptInput.focus();

    }

}

/* ----------------------------
   Send Button
-----------------------------*/
sendBtn.addEventListener("click", sendMessage);

/* ----------------------------
   Enter to Send
-----------------------------*/
promptInput.addEventListener("keydown", e => {

    if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();

        sendMessage();

    }

});

/* ----------------------------
   Clear Chat
-----------------------------*/
clearBtn.addEventListener("click", () => {

    history = [];

    localStorage.removeItem("chatHistory");

    chatBox.innerHTML = `
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

    promptInput.focus();

});
