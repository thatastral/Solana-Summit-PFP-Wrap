export const REGISTER_URL = "https://luma.com/Solana-Summit-Nigeria";

// Summit starts August 8th, 9AM prompt.
export const EVENT_DATE = "2026-08-08T09:00:00";

export const EVENT_NAME = "Solana Summit Nigeria";

export const SUPABASE_FUNCTION_BASE = "make-server-07da931a";

/**
 * Local/preview testing must not pollute the public download count. Only
 * real visitors on the deployed site are counted.
 */
export const IS_PRODUCTION =
  typeof window !== "undefined" &&
  !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname) &&
  !window.location.hostname.endsWith(".local");
