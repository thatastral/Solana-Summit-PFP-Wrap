import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-07da931a/health", (c) => {
  return c.json({ status: "ok" });
});

// Get current frame count
app.get("/make-server-07da931a/frames/count", async (c) => {
  try {
    const count = await kv.get("frame_download_count");
    return c.json({ count: count || 0 });
  } catch (error) {
    console.log("Error getting frame count:", error);
    return c.json({ error: "Failed to get frame count", details: String(error) }, 500);
  }
});

// Increment frame count
app.post("/make-server-07da931a/frames/increment", async (c) => {
  try {
    const currentCount = await kv.get("frame_download_count");
    const newCount = (currentCount || 0) + 1;
    await kv.set("frame_download_count", newCount);
    return c.json({ count: newCount });
  } catch (error) {
    console.log("Error incrementing frame count:", error);
    return c.json({ error: "Failed to increment frame count", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);