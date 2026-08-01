import { projectId, publicAnonKey } from "../utils/supabase/info";
import { SUPABASE_FUNCTION_BASE } from "../config";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/${SUPABASE_FUNCTION_BASE}`;

const headers = {
  Authorization: `Bearer ${publicAnonKey}`,
  "Content-Type": "application/json",
};

export interface FeedState {
  count: number;
  recent: string[];
}

/**
 * How often the landing page refreshes the counter and faces strip.
 *
 * This is the only sustained server load the site generates -- everything
 * else (image generation included) is client-side. At one poll per second
 * per visitor, a thousand concurrent people meant ~2,000 requests/second
 * against the edge function, each a Postgres round trip. At this interval
 * the same crowd costs well under a hundred, and edge caching absorbs most
 * of that again.
 */
const POLL_MS = 12_000;
/** Spread so a thousand tabs opened together don't all fire on the same tick. */
const POLL_JITTER_MS = 4_000;

export function nextPollDelay(): number {
  return POLL_MS + Math.random() * POLL_JITTER_MS;
}

/**
 * One request for both numbers.
 *
 * Prefers the combined `frames/feed` endpoint; if the deployed function
 * predates it, falls back to the original pair so the site keeps working
 * through a backend rollout rather than going blank.
 *
 * Returns `null` when the numbers could not be read, rather than zeroes.
 * A poll that fails -- a dropped mobile connection, a redeploy mid-flight --
 * must leave the last known figures on screen; substituting zero would flash
 * "0 attending" and an empty strip at everyone whose signal wavered.
 */
export async function fetchFeed(): Promise<FeedState | null> {
  try {
    const response = await fetch(`${BASE_URL}/frames/feed`, { headers });
    if (response.ok) {
      const data = await response.json();
      return {
        count: data.count ?? 0,
        recent: Array.isArray(data.thumbnails) ? data.thumbnails : [],
      };
    }
  } catch {
    /* falls through to the legacy pair */
  }

  try {
    const [countRes, recentRes] = await Promise.all([
      fetch(`${BASE_URL}/frames/count`, { headers }),
      fetch(`${BASE_URL}/frames/recent`, { headers }),
    ]);
    if (!countRes.ok || !recentRes.ok) return null;
    const countData = await countRes.json();
    const recentData = await recentRes.json();
    return {
      count: countData.count ?? 0,
      recent: Array.isArray(recentData.thumbnails) ? recentData.thumbnails : [],
    };
  } catch (error) {
    console.log("Failed to fetch attendee feed:", error);
    return null;
  }
}

/**
 * Records a download. Throws if the server refused it, so the caller can
 * leave the displayed figures untouched and allow a retry -- the server
 * rejects malformed thumbnails outright, and a rejection must not be
 * mistaken for "the count is now zero".
 */
export async function reportGenerated(thumbnail: string): Promise<FeedState> {
  const response = await fetch(`${BASE_URL}/frames/increment`, {
    method: "POST",
    headers,
    body: JSON.stringify({ thumbnail }),
  });
  if (!response.ok) throw new Error(`increment failed: ${response.status}`);
  const data = await response.json();
  return {
    count: data.count ?? 0,
    recent: Array.isArray(data.recent) ? data.recent : [],
  };
}
