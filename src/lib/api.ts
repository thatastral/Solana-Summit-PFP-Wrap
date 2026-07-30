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

export async function fetchFeed(): Promise<FeedState> {
  try {
    const [countRes, recentRes] = await Promise.all([
      fetch(`${BASE_URL}/frames/count`, { headers }),
      fetch(`${BASE_URL}/frames/recent`, { headers }),
    ]);
    const countData = await countRes.json();
    const recentData = await recentRes.json();
    return {
      count: countData.count ?? 0,
      recent: Array.isArray(recentData.thumbnails) ? recentData.thumbnails : [],
    };
  } catch (error) {
    console.log("Failed to fetch attendee feed:", error);
    return { count: 0, recent: [] };
  }
}

export async function reportGenerated(thumbnail: string): Promise<FeedState> {
  try {
    const response = await fetch(`${BASE_URL}/frames/increment`, {
      method: "POST",
      headers,
      body: JSON.stringify({ thumbnail }),
    });
    const data = await response.json();
    return {
      count: data.count ?? 0,
      recent: Array.isArray(data.recent) ? data.recent : [],
    };
  } catch (error) {
    console.log("Failed to report generated frame:", error);
    return { count: 0, recent: [] };
  }
}
