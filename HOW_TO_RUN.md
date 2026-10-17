# 🚀 VITXPLORE — Complete Run & Deployment Guide

This guide contains everything you need to run, test, and deploy the **VITXplore** portal.

---

## 📌 Project Architecture

The application consists of 3 services working together:

| Component | Technology | Directory / File | Port | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend UI** | HTML5, CSS3, Vanilla JS | `The_real_VITXPLORE-change/.../vit_ui_demo` | `5500` | User login, register, student feeds, real-time chat UI |
| **Backend API** | Node.js, Express, Socket.IO, Mongoose | `vit-auth-secure-5 change/vit-auth-secure-5` | `5000` | Auth, posts, chat history, user management, OTP mailing |
| **AI Abuse Service** | Python, Flask, HuggingFace Toxic-BERT | `.../models-service/bert_service.py` | `5050` | Real-time toxicity & abuse detection for chat messages |
| **Database** | MongoDB Atlas (Cloud) | `cluster0.enhhduk.mongodb.net` | Cloud | User accounts, hashed passwords, chats, posts |
| **Mailing Service** | Gmail SMTP (Nodemailer) | `shin9sho@gmail.com` | Cloud | Sends 6-digit OTP verification emails upon registration |

---

## ⚡ Option A: 1-Click Launch (Easiest Local Run)

Double-click the **`start_all.bat`** file in the root folder, or run in PowerShell:

```powershell
.\start_all.bat
```

This single command automatically:
1. Starts the Python BERT AI service on port `5050`.
2. Starts the Node.js backend server on port `5000`.
3. Starts the frontend static server on port `5500`.
4. Opens your browser directly to `http://127.0.0.1:5500/login.html`.

---

## 🛠️ Option B: Manual Step-by-Step Run (Separate Terminals)

If you prefer to start each service manually in separate terminal tabs:

### Terminal 1: Python AI Abuse Service (Port 5050)
```powershell
cd "c:\Users\daksh\OneDrive\Documents\Projects\VITXplore\vit-auth-secure-5 change\vit-auth-secure-5\models-service"
python bert_service.py
```
*Expected output:* `✅ Abuse detection server running on port 5050`

### Terminal 2: Node.js Backend Server (Port 5000)
From the root directory:
```powershell
cd "c:\Users\daksh\OneDrive\Documents\Projects\VITXplore"
npm start
```
*Expected output:*
```text
🚀 Server running with Socket.IO on http://localhost:5000
🤖 BERT model connected successfully → model_predicted
✅ MongoDB Connected
```

### Terminal 3: Frontend Web UI (Port 5500)
Serve using Python HTTP server or VS Code Live Server:
```powershell
cd "c:\Users\daksh\OneDrive\Documents\Projects\VITXplore\The_real_VITXPLORE-change\The_real_VITXPLORE-chat\The_real_VITXPLORE-5\vit_ui_demo\vit_ui_demo"
python -m http.server 5500 --bind 127.0.0.1
```
*Open in Browser:* **`http://127.0.0.1:5500/login.html`** or **`register.html`**

---

## 🔐 Credentials & Environment Setup (`.env`)

Location: `vit-auth-secure-5 change\vit-auth-secure-5\.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://dakshania21_db_user:87xw4CsfdfxEdA59@cluster0.enhhduk.mongodb.net/vitxplore?retryWrites=true&w=majority
JWT_SECRET=7vH!mZ9p@X3$eBqL1

# Email Config (Gmail App Password)
EMAIL_USER=shin9sho@gmail.com
EMAIL_PASS=qime hhne sjci ibmu
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000/api/auth
```

> [!IMPORTANT]
> The email password (`EMAIL_PASS`) must always be a **16-letter Google App Password**, not a normal Gmail password.

---

## 🌐 Deploying to the Internet (Public Cloud)

To make VITXplore accessible to anyone over a public web link (like `https://vitxplore.onrender.com`):

### Best Free Hosting Setup:
1. **Database & Email**: Already hosted in the cloud (MongoDB Atlas & Gmail).
2. **Node.js Backend**: Deploy on [Render.com](https://render.com) (Web Service, Node runtime).
3. **Python AI Service**: Deploy on [Render.com](https://render.com) (Web Service, Python runtime) or [Railway.app](https://railway.app).
4. **Frontend**: Deploy on [Vercel](https://vercel.com) or [Netlify](https://netlify.com) or serve directly through Express.

---

## ❓ Troubleshooting

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| `listen EADDRINUSE: :::5000` | A previous Node process is still running. | Run `Stop-Process -Name node -Force` in PowerShell. |
| `⚠️ Flask model not reachable` | `bert_service.py` is not running. | Run `python bert_service.py` in Terminal 1. |
| `querySrv ECONNREFUSED` | Windows DNS blocked MongoDB SRV record. | Handled automatically by `dns.setServers(['8.8.8.8'])` in `server.js`. Ensure your IP is whitelisted in MongoDB Atlas. |
| Registration fails with email error | Gmail rejected credentials. | Ensure a valid Google App Password is set in `.env`. |
