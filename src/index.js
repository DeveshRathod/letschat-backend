import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectionDB from "./database/connections.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import friendsRouter from "./routes/friends.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

connectionDB();

io.on("connection", (socket) => {
  console.log("🔌 A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

app.set("io", io);

httpServer.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log(`✅ Server is now live at port ${process.env.PORT}`);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    Message: `Currently running on ${process.env.PORT}`,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/friends", friendsRouter);

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const staticPath = path.join(__dirname, "..", "..", "frontend", "dist");

// console.log("Static path:", staticPath);
// app.use(express.static(staticPath));

// app.get("/", (req, res) => {
//   res.sendFile("index.html", {
//     root: staticPath,
//   });
// });c
