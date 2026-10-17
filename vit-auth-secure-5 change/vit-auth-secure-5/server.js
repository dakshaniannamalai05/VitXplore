require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom dns fails
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const axios = require("axios");

const app = express();

// ✅ Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:5000",
  "http://127.0.0.1:5000"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require("./routes/chatRoutes");
const abuseRoute = require("./routes/abuseRoute");

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat", abuseRoute);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// ✅ Socket.IO Setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("chatMessage", (msg) => {
    console.log("💬 Message received:", msg);
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Serve frontend (only for non-API routes)
const frontendPath = path.join(
  __dirname,
  "../../The_real_VITXPLORE-change/The_real_VITXPLORE-chat/The_real_VITXPLORE-5/vit_ui_demo/vit_ui_demo"
);
app.use(express.static(frontendPath));

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Check if Flask model server is online
async function checkModelServer() {
  try {
    const res = await axios.post("http://127.0.0.1:5050/check-abuse", {
      message: "test"
    });
    console.log(`🤖 BERT model connected successfully → ${res.data.source}`);
  } catch (err) {
    console.warn("⚠️ Flask model (bert_service.py) not reachable on port 5050.");
    console.warn("   ➤ Run it using: python models-service/bert_service.py");
  }
}

// ✅ Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, async () => {
  console.log(`🚀 Server running with Socket.IO on http://localhost:${PORT}`);
  await checkModelServer(); // test Flask connection at startup
});
