import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", logger(console.log));
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

// Namespaced separately from the 2025 site's "frame_download_count" key so
// the two versions don't share/clobber each other's counters.
const COUNT_KEY = "summit2026_frame_count";
const GALLERY_KEY = "summit2026_gallery";
const RECENT_LIMIT = 8;
// Cap on stored thumbnails. Kept around (beyond what the "recent" preview
// strip shows) as the future mosaic feature's data source -- see brief's
// "future-ready backend structure for mosaic" requirement. No mosaic UI here.
const GALLERY_LIMIT = 500;

app.get("/make-server-07da931a/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/make-server-07da931a/frames/count", async (c) => {
  try {
    const count = (await kv.get(COUNT_KEY)) || 0;
    return c.json({ count });
  } catch (error) {
    console.log("Error getting frame count:", error);
    return c.json({ error: "Failed to get frame count", details: String(error) }, 500);
  }
});

app.get("/make-server-07da931a/frames/recent", async (c) => {
  try {
    const gallery: string[] = (await kv.get(GALLERY_KEY)) || [];
    const thumbnails = gallery.slice(-RECENT_LIMIT).reverse();
    return c.json({ thumbnails });
  } catch (error) {
    console.log("Error getting recent frames:", error);
    return c.json({ error: "Failed to get recent frames", details: String(error) }, 500);
  }
});

app.post("/make-server-07da931a/frames/increment", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const thumbnail: string | undefined = body?.thumbnail;

    const currentCount = (await kv.get(COUNT_KEY)) || 0;
    const newCount = currentCount + 1;

    const tasks: Promise<void>[] = [kv.set(COUNT_KEY, newCount)];

    let gallery: string[] = [];
    if (thumbnail && typeof thumbnail === "string") {
      gallery = (await kv.get(GALLERY_KEY)) || [];
      gallery = [...gallery, thumbnail].slice(-GALLERY_LIMIT);
      tasks.push(kv.set(GALLERY_KEY, gallery));
    }

    await Promise.all(tasks);

    return c.json({
      count: newCount,
      recent: gallery.slice(-RECENT_LIMIT).reverse(),
    });
  } catch (error) {
    console.log("Error incrementing frame count:", error);
    return c.json({ error: "Failed to increment frame count", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
