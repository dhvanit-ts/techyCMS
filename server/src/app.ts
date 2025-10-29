import { env } from "./conf/env";
import express from 'express';
import { Server } from 'socket.io';
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import http from 'http';
// routes
import healthRouter from "./routes/health.route";
import adminRouter from "./routes/admin.route";
import pagesRouter from "./routes/pages.route";
import componentsRouter from "./routes/components.route";
import linkRouter from "./routes/link.route";
import sectionRouter from "./routes/section.route";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.ACCESS_CONTROL_ORIGIN,
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

const corsOptions: CorsOptions = {
  origin: env.ACCESS_CONTROL_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

io.on('connection', (socket) => {
  // define your function
});

// routes
app.use("/api/v1/health", healthRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/pages", pagesRouter)
app.use("/api/v1/components", componentsRouter)
app.use("/api/v1/links", linkRouter)
app.use("/api/v1/sections", sectionRouter)

export default server;