// login.js
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const msg = document.getElementById("msg");

btnLogin.onclick = async () => {
  const email = emailEl.value.trim().toLowerCase();
  const pass = passwordEl.value;

  msg.textContent = "";
  msg.className = "";

  if (!email || !pass) {
    msg.className = "error-msg";
    msg.textContent = "❌ Enter email and password!";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass })
    });

    const data = await res.json();
    console.log("API response:", data);

    if (res.ok) {
      msg.className = "success-msg";
      msg.textContent = "✅ Login successful! Redirecting...";

      // ✅ Save token
      localStorage.setItem("vit_token", data.token);

      // ✅ Save logged-in user data
      if (data.user) {
        localStorage.setItem("username", data.user.name); // Existing
        localStorage.setItem("vit_current", JSON.stringify(data.user)); // Existing

        // 🚀 ADD THESE TWO LINES
        localStorage.setItem("loggedInUserId", data.user._id);  // User ID for chat
        localStorage.setItem("loggedInUsername", data.user.name); // Optional
      }

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1500);
    } else {
      msg.className = "error-msg";
      msg.textContent = data.message || "❌ Login failed!";
    }
  } catch (err) {
    msg.className = "error-msg";
    msg.textContent = "❌ Error connecting to server";
    console.error(err);
  }
};
