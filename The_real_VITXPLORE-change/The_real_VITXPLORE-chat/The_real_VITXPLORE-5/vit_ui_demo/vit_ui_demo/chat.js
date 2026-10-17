document.addEventListener("DOMContentLoaded", () => {
  const chatUserId = localStorage.getItem("chatUserId");         // The other user
  const chatUsername = localStorage.getItem("chatUsername") || "User";
  const loggedInUserId = localStorage.getItem("loggedInUserId"); // YOU
  const token = localStorage.getItem("vit_token");

  const chatWith = document.getElementById("chatWith");
  const messagesDiv = document.getElementById("messages");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");

  // Feedback message container for abusive content
  const feedbackMsg = document.createElement("p");
  feedbackMsg.id = "abuseWarning";
  feedbackMsg.style.color = "red";
  feedbackMsg.style.fontSize = "14px";
  feedbackMsg.style.marginTop = "5px";
  messageInput.parentElement.appendChild(feedbackMsg);

  if (!chatUserId) {
    chatWith.textContent = "No user selected!";
    return;
  }

  chatWith.textContent = `Chat with ${chatUsername}`;

  // ===== Helper to render a single message =====
  function renderMessage(msg) {
    console.log("Message received:", JSON.stringify(msg));

    const msgWrapper = document.createElement("div");
    msgWrapper.classList.add("message-wrapper");

    const senderName = (String(msg.senderId) === String(loggedInUserId))
      ? "You"
      : msg.senderName || chatUsername;

    const nameDiv = document.createElement("div");
    nameDiv.classList.add("message-header");
    nameDiv.textContent = senderName;

    const bodyDiv = document.createElement("div");
    bodyDiv.classList.add("message-body");
    bodyDiv.textContent = msg.text;

    if (String(msg.senderId) === String(loggedInUserId)) {
      msgWrapper.style.alignItems = "flex-end";
      bodyDiv.classList.add("sent");
    } else {
      msgWrapper.style.alignItems = "flex-start";
      bodyDiv.classList.add("received");
    }

    msgWrapper.appendChild(nameDiv);
    msgWrapper.appendChild(bodyDiv);
    messagesDiv.appendChild(msgWrapper);

    // Scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  const API_BASE = (window.location.port === "5500") ? "http://localhost:5000" : window.location.origin;

  // ===== Load chat history =====
  fetch(`${API_BASE}/api/chat/${chatUserId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error("Chat history not found");
      return res.json();
    })
    .then(messages => {
      messagesDiv.innerHTML = "";
      messages.forEach(msg => renderMessage(msg));
    })
    .catch(err => {
      console.error("Error loading chat:", err);
      messagesDiv.innerHTML = "<p style='color:red;'>Failed to load chat.</p>";
    });

  // ===== Abuse check function (with score logging) =====
async function checkAbuse(text) {
  if (!text) {
    feedbackMsg.textContent = "";
    sendBtn.disabled = false;
    return false;
  }

  try {
    const res = await fetch(`${API_BASE}/api/chat/check-abuse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    // 🧠 Log model output for tuning
    console.log("🔍 BERT model output:", data);

    // Optional: Use toxicity probability if backend returns it
    const toxicityScore = data.score || 0.0; // backend can return 'score' between 0-1
    const threshold = 0.75; // adjust this value to make filter stricter or looser

    // If backend sends class only (1 or 0)
    const isAbusive = data.isAbusive || (toxicityScore > threshold);

console.log(`🧩 Model check → Abusive: ${data.isAbusive}, Score: ${data.score}, Source: ${data.source}`);

if (data.isAbusive) {
  feedbackMsg.textContent = `⚠️ Abusive content detected (score: ${data.score.toFixed(2)})`;
  sendBtn.disabled = true;
  return true;
} else {
  feedbackMsg.textContent = "";
  sendBtn.disabled = false;
  return false;
}


  } catch (err) {
    console.warn("Abuse check failed:", err);
    feedbackMsg.textContent = "";
    sendBtn.disabled = false;
    return false;
  }
}


  // ===== Debounce user input =====
  let debounceTimer;
  messageInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      checkAbuse(messageInput.value.trim());
    }, 300);
  });

  // ===== Send message =====
  sendBtn.addEventListener("click", async () => {
    const text = messageInput.value.trim();
    if (!text) return;

    const isAbusive = await checkAbuse(text);
    if (isAbusive) return;

    try {
      const res = await fetch(`${API_BASE}/api/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId: chatUserId, text })
      });

      if (!res.ok) throw new Error("Failed to send");

      const newMsg = await res.json();
      renderMessage(newMsg);
      messageInput.value = "";
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message.");
    }
  });
});
