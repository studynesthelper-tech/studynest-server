// StudyNest Proxy Server
// Deploy on Railway / Render / Fly.io — free tier handles thousands of users
import "dotenv/config";
import express from "express";
import cors from "cors";
import { router as authRouter } from "./routes/auth.js";
import { router as aiRouter } from "./routes/ai.js";
import { router as userRouter } from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ── CORS — allow your extension + your website ───────────────
const ALLOWED_ORIGINS = [
  "chrome-extension://",    // any extension origin (checked by prefix below)
  process.env.WEBSITE_URL,  // your website if you have one
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // server-to-server / curl
    if (origin.startsWith("chrome-extension://")) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" })); // 10mb for image payloads

// ── Routes ───────────────────────────────────────────────────
app.use("/auth", authRouter);
app.use("/ai",   aiRouter);
app.use("/user", userRouter);

// ── Health check ─────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => console.log(`StudyNest server running on port ${PORT}`));
