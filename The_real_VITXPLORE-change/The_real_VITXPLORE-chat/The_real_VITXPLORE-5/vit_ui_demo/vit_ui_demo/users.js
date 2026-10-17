document.addEventListener("DOMContentLoaded", () => {
  const usersList = document.getElementById("usersList");
  const token = localStorage.getItem("vit_token");

  if (!token) {
    usersList.innerHTML = "<p>Please log in to see users.</p>";
    return;
  }

  fetch("http://localhost:5000/api/user/users", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    })
    .then(users => {
      console.log("✅ Users from API:", users);

      if (!Array.isArray(users) || users.length === 0) {
        usersList.innerHTML = "<p>No users found.</p>";
        return;
      }

      const currentUser = parseJwt(token);
      usersList.innerHTML = ""; // Clear any old content

      users
        .filter(user => user && user._id && (user.username || user.name || user.email)) // ✅ Only valid users
        .forEach(user => {
          // Skip logged-in user
          if (currentUser && user._id === currentUser.id) return;

          // ✅ Safely get user details
          const displayName = user.username || user.name || user.email || "Anonymous";
          const profilePic =
            user.profilePic && user.profilePic !== "undefined"
              ? user.profilePic
              : user.pic && user.pic !== "undefined"
              ? user.pic
              : "default.png";

          // ✅ Create user card
          const card = document.createElement("div");
          card.classList.add("user-card");
          card.innerHTML = `
            <img src="${profilePic}" alt="${displayName}" class="user-avatar">
            <span>${displayName}</span>
          `;

          // ✅ On click, open chat
          card.addEventListener("click", () => {
            localStorage.setItem("chatUserId", user._id);
            localStorage.setItem("chatUsername", displayName);
            window.location.href = "chat.html";
          });

          usersList.appendChild(card);
        });

      // ✅ If all were invalid/filtered out
      if (usersList.innerHTML.trim() === "") {
        usersList.innerHTML = "<p>No valid users found.</p>";
      }
    })
    .catch(err => {
      console.error("❌ Error loading users:", err);
      usersList.innerHTML = `<p style="color:red;">Error loading users. Check console.</p>`;
    });
});

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}
