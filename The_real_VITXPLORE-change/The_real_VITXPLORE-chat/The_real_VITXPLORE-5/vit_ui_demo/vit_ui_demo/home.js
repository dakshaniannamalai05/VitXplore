// home.js

// =========================
// ✅ Elements
// =========================
const btnShare = document.getElementById("btnShare");
const postInput = document.getElementById("post-input");
const mediaInput = document.getElementById("media-upload");
const postsContainer = document.getElementById("posts");

const btnSetBio = document.getElementById("btnSetBio");
const btnUploadPic = document.getElementById("btnUploadPic");
const uploadProfile = document.getElementById("upload-profile");

const profilePic = document.getElementById("profile-pic");
const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");

// =========================
// ✅ Helper: Convert file to Base64
// =========================
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = err => reject(err);
  });
}

// =========================
// ✅ Helper: Get token
// =========================
function getToken() {
  return localStorage.getItem("vit_token");
}

// =========================
// ✅ Load current user info
// =========================
async function loadUser() {
  const token = getToken();
  if (!token) return alert("Not logged in");

  try {
    const res = await fetch("http://localhost:5000/api/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    const data = await res.json();

      // 👇 ADD THIS LINE HERE
    console.log("User data:", data);

    usernameEl.innerText = data.name;
    bioEl.innerText = data.bio || "No bio yet";
    profilePic.src = data.pic || "default.png";

    // 👇 Add these lines
document.getElementById("followers").innerText = data.followers?.length || 0;
document.getElementById("following").innerText = data.following?.length || 0;


  } catch (err) {
    console.error("loadUser error:", err);
  }
}


document.getElementById("btnEditProfile").addEventListener("click", () => {
  const options = document.getElementById("editOptions");
  options.style.display = options.style.display === "none" ? "block" : "none";
});

// =========================
// ✅ Share post
// =========================
async function sharePost() {
  const token = getToken();
  if (!token) return alert("You must be logged in!");

  const text = postInput.value.trim();
  const file = mediaInput.files[0];

  let mediaBase64 = null, type = null;
  if (file) {
    type = file.type.startsWith("image") ? "image" : "video";
    mediaBase64 = await toBase64(file);
  }

  if (!text && !mediaBase64) return alert("Post cannot be empty");

  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ text, media: mediaBase64, type })
    });

    const data = await res.json();
    if (res.ok) {
      postInput.value = "";
      mediaInput.value = "";
      loadPosts();
    } else {
      alert(data.message || "Failed to share post");
    }
  } catch (err) {
    console.error("sharePost error:", err);
  }
}

// =========================
// ✅ Load posts
// =========================
async function loadPosts() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/posts", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch posts");
    const posts = await res.json();

    postsContainer.innerHTML = "";

    posts.forEach(post => {
      const postEl = document.createElement("div");
      postEl.className = "post";

      // Safely get user info
      const userName = post.user?.name || "Unknown";
      const userPic = post.user?.pic || "default.png";

      // Post text
      const textEl = document.createElement("p");
      textEl.innerHTML = `<b>${userName}</b>: ${post.text || ""}`;
      postEl.appendChild(textEl);

      // Post media
      if (post.media) {
        if (post.type === "image") {
          const img = document.createElement("img");
          img.src = post.media;
          postEl.appendChild(img);
        } else if (post.type === "video") {
          const video = document.createElement("video");
          video.controls = true;
          video.src = post.media;
          postEl.appendChild(video);
        }
      }

      // Like button
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "post-actions";
      const likeBtn = document.createElement("button");
      likeBtn.innerText = `Like (${post.likes?.length || 0})`;
      likeBtn.addEventListener("click", () => likePost(post._id));
      actionsDiv.appendChild(likeBtn);

      postEl.appendChild(actionsDiv);
      postsContainer.appendChild(postEl);
    });

  } catch (err) {
    console.error("loadPosts error:", err);
  }
}

// =========================
// ✅ Like post
// =========================
async function likePost(postId) {
  const token = getToken();
  if (!token) return;

  try {
    await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });
    loadPosts();
  } catch (err) {
    console.error("likePost error:", err);
  }
}

// =========================
// ✅ Update Bio
// =========================
async function updateBio() {
  const bio = prompt("Enter your new bio:");
  if (!bio) return;

  const token = getToken();
  try {
    const res = await fetch("http://localhost:5000/api/user/update-bio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ bio })
    });
    const data = await res.json();
    if (res.ok) {
      bioEl.innerText = data.bio;
      alert("Bio updated!");
    } else alert(data.error || "Failed to update bio");
  } catch (err) {
    console.error("updateBio error:", err);
  }
}

// =========================
// ✅ Update Profile Pic
// =========================
async function updateProfilePic(file) {
  if (!file) return;
  const pic = await toBase64(file);
  const token = getToken();

  try {
    const res = await fetch("http://localhost:5000/api/user/update-pic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ pic })
    });
    const data = await res.json();
    if (res.ok) {
      profilePic.src = data.pic;
      alert("Profile picture updated!");
    } else alert(data.error || "Failed to update profile picture");
  } catch (err) {
    console.error("updateProfilePic error:", err);
  }
}

// =========================
// ✅ Logout
// =========================
const btnLogout = document.getElementById("btnLogout");
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("vit_token");
  localStorage.removeItem("username");
  localStorage.removeItem("vit_current");
  window.location.href = "login.html";
});

// =========================
// ✅ Load user suggestions
// =========================
async function loadSuggestions() {
  const token = getToken();
  if (!token) return;

  try {
    const res = await fetch("http://localhost:5000/api/user/users", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const users = await res.json();
    const suggestionsEl = document.getElementById("suggestions");
    suggestionsEl.innerHTML = "";

    users.forEach(user => {
      const div = document.createElement("div");
      div.classList.add("suggestion-card");

      const img = document.createElement("img");
      img.src = user.pic || "default.png";
      img.alt = user.name;

      const nameSpan = document.createElement("span");
      nameSpan.textContent = user.name;

      const followBtn = document.createElement("button");
    if (user.isFollowing) {
  followBtn.textContent = "Following";
  followBtn.classList.add("following");
  followBtn.style.background = "#28a745";
} else {
  followBtn.textContent = "Follow";
  followBtn.classList.remove("following");
  followBtn.style.background = "#007bff";
}
      followBtn.addEventListener("click", () => followUser(user._id, followBtn));

      div.appendChild(img);
      div.appendChild(nameSpan);
      div.appendChild(followBtn);
      suggestionsEl.appendChild(div);
    });

    if (users.length === 0)
      suggestionsEl.innerHTML = `<p style="color: gray; padding: 10px;">No suggestions available</p>`;

  } catch (err) {
    console.error("Error loading suggestions:", err);
  }
}
// =========================
// ✅ Follow a user (clean)
// =========================
async function followUser(userId, btn) {
  const token = localStorage.getItem("vit_token");
  if (!token) {
    alert("You must be logged in to follow someone!");
    return;
  }

  try {
    const isFollowing = btn.classList.contains("following");

    const url = isFollowing
      ? `http://localhost:5000/api/user/unfollow/${userId}` // unfollow API
      : `http://localhost:5000/api/user/follow/${userId}`;  // follow API

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      if (isFollowing) {
        btn.textContent = "Follow";
        btn.classList.remove("following");
        btn.style.background = "#007bff";

        // Decrease following count
        let count = parseInt(document.getElementById("following").innerText);
        document.getElementById("following").innerText = count - 1;
      } else {
        btn.textContent = "Following";
        btn.classList.add("following");
        btn.style.background = "#28a745";

        // Increase following count
        let count = parseInt(document.getElementById("following").innerText);
        document.getElementById("following").innerText = count + 1;
      }
      loadUser();
    } else {
      alert(data.error || "Failed to follow/unfollow user");
    }

  } catch (err) {
    console.error("Error following/unfollowing user:", err);
  }
}

// =========================
// ✅ Messages
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const messageBtn = document.getElementById("btnMessage");
  if (messageBtn) {
    messageBtn.addEventListener("click", () => {
      window.location.href = "users.html";
    });
  }
});

// =========================
// ✅ Event listeners
// =========================
btnShare.addEventListener("click", sharePost);
btnSetBio.addEventListener("click", updateBio);
btnUploadPic.addEventListener("click", () => uploadProfile.click());
uploadProfile.addEventListener("change", e => updateProfilePic(e.target.files[0]));

// =========================
// ✅ Initialize
// =========================
loadUser();
loadPosts();
loadSuggestions();
