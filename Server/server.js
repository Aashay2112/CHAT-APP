import dotenv from "dotenv";
dotenv.config(); // <-- FIRST LINE
import express from "express";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";


const app = express();
const server = http.createServer(app);

// Initialize Socket.io
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
// Increase the JSON body limit to handle base64-encoded images sent from the client
app.use(express.json({ limit: "8mb" }));
app.use(cors());

// Routes
app.use("/api/status", (req, res) => {
  res.send("Server is live 🚀");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect DB
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
