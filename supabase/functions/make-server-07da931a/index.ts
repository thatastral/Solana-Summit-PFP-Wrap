import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

/*
  Backing store is the existing table:
    CREATE TABLE kv_store_07da931a (key TEXT PRIMARY KEY, value JSONB NOT NULL);

  Scale notes, because this is the only server the site has -- image
  generation is entirely client-side:

  - Reads are the hot path. Every visitor polls the landing page, so the
    feed endpoint is one query returning both numbers, and it is cacheable
    at the CDN, so a crowd arriving together mostly never reaches Postgres.

  - A download writes exactly one row: its own thumbnail, under a unique
    key. Nothing is read first and nothing shared is rewritten, so
    simultaneous downloads cannot overwrite one another.

  - Both the total and the faces strip are DERIVED from those rows -- a
    COUNT for one, the newest few for the other. Keeping either as its own
    stored value means read-modify-write, and under load that silently
    loses entries: five simultaneous downloads produced a count of one and
    a strip missing four faces. Deriving them makes both exact by
    construction, and keeps them consistent with each other.

  - Keys embed a millisecond timestamp, so ordering by key descending is
    ordering by most recent.
*/

const db = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

const THUMB_PREFIX = "summit2026_thumb_";
const RECENT_LIMIT = 8;

/*
  What may be written, and how much of it.

  The thumbnails posted here are displayed publicly on the landing page, and
  the endpoint is reachable by anyone -- the anon key that authorises it ships
  in the JavaScript bundle, as it must. Without these checks any caller could
  put an arbitrary string, or an arbitrary picture, on the front page of the
  event site, and grow the table without bound while doing it.

  This cannot decide whether a real photo is an appropriate one; that needs a
  human. What it does is make every stored row a small, genuine raster image,
  so the failure mode stays "someone posted a picture" rather than "someone
  posted anything at all".
*/
const ALLOWED_THUMB = /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/]+={0,2}$/;
/** The client sends a 96px JPEG at q0.72 -- a few KB. This is generous. */
const MAX_THUMB_CHARS = 32_000;

const isValidThumbnail = (value: unknown): value is string =>
  typeof value === "string" &&
  value.length <= MAX_THUMB_CHARS &&
  ALLOWED_THUMB.test(value);

/** Seconds the CDN may serve a cached feed response to other visitors. */
const FEED_CACHE_SECONDS = 10;

const kvSet = async (key: string, value: unknown) => {
  const { error } = await db().from("kv_store_07da931a").upsert({ key, value });
  if (error) throw new Error(error.message);
};

/**
 * The total, counted from the archived rows themselves.
 *
 * `head: true` asks Postgres for the count without returning any rows, and
 * the prefix match runs against the primary key's index.
 */
const readCount = async (): Promise<number> => {
  const { count, error } = await db()
    .from("kv_store_07da931a")
    .select("key", { count: "exact", head: true })
    .like("key", `${THUMB_PREFIX}%`);
  if (error) throw new Error(error.message);
  return count ?? 0;
};

/** The newest few thumbnails, straight from the archive rows. */
const readRecent = async (): Promise<string[]> => {
  const { data, error } = await db()
    .from("kv_store_07da931a")
    .select("value")
    .like("key", `${THUMB_PREFIX}%`)
    .order("key", { ascending: false })
    .limit(RECENT_LIMIT);
  if (error) throw new Error(error.message);
  return (data ?? [])
    .map((r) => r.value)
    .filter((v): v is string => typeof v === "string");
};

const readFeed = async (): Promise<{ count: number; thumbnails: string[] }> => {
  const [count, thumbnails] = await Promise.all([readCount(), readRecent()]);
  return { count, thumbnails };
};

const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    maxAge: 600,
  }),
);

app.get("/make-server-07da931a/health", (c) => c.json({ status: "ok" }));

// Combined endpoint the site polls. One request, one query, cacheable.
app.get("/make-server-07da931a/frames/feed", async (c) => {
  try {
    const feed = await readFeed();
    c.header(
      "Cache-Control",
      `public, max-age=0, s-maxage=${FEED_CACHE_SECONDS}, stale-while-revalidate=30`,
    );
    return c.json(feed);
  } catch (error) {
    return c.json({ error: "Failed to read feed", details: String(error) }, 500);
  }
});

// Kept so a cached copy of an older frontend keeps working.
app.get("/make-server-07da931a/frames/count", async (c) => {
  try {
    const { count } = await readFeed();
    c.header("Cache-Control", `public, max-age=0, s-maxage=${FEED_CACHE_SECONDS}`);
    return c.json({ count });
  } catch (error) {
    return c.json({ error: "Failed to get count", details: String(error) }, 500);
  }
});

app.get("/make-server-07da931a/frames/recent", async (c) => {
  try {
    const { thumbnails } = await readFeed();
    c.header("Cache-Control", `public, max-age=0, s-maxage=${FEED_CACHE_SECONDS}`);
    return c.json({ thumbnails });
  } catch (error) {
    return c.json({ error: "Failed to get recent", details: String(error) }, 500);
  }
});

app.post("/make-server-07da931a/frames/increment", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const thumbnail: unknown = body?.thumbnail;

    if (!isValidThumbnail(thumbnail)) {
      // Rejected outright rather than counted. The row is what the total is
      // made of, so accepting a bad one would inflate the number too.
      return c.json({ error: "Invalid thumbnail" }, 400);
    }

    // The one write. A unique key, so concurrent downloads each add their
    // own row rather than racing over anything shared.
    await kvSet(
      `${THUMB_PREFIX}${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
      thumbnail,
    );

    const feed = await readFeed();
    return c.json({ count: feed.count, recent: feed.thumbnails });
  } catch (error) {
    return c.json({ error: "Failed to increment", details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
