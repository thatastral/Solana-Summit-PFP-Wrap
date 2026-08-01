import { REGISTER_URL } from "../config";

/**
 * Saving and sharing the generated assets.
 *
 * The two buttons take deliberately different routes, because they are asking
 * for different things:
 *
 * - **Download** always saves the files directly, on every device. It never
 *   raises the share sheet. Tapping "Download" and being asked where to
 *   *send* things is a different action from the one the button offered, and
 *   dismissing that sheet used to leave the user with nothing at all.
 *
 * - **Share on X** does raise the sheet, on mobile only, and that is the
 *   point: X's web intent carries text and a URL but cannot carry an image,
 *   so handing the card to the OS is the one route that gets the picture into
 *   the post. Desktop has no such sheet, so it falls back to opening the
 *   composer with the copy filled in and saving the card to attach.
 */

const SITE_URL =
  typeof window !== "undefined" ? window.location.origin : "https://solana-summit26-pfp-wrap.vercel.app";

export const SHARE_TEXT = `Just reserved my spot at Solana Summit Nigeria.

Create your official Summit identity 👇`;

/**
 * Triggers a save via a blob URL rather than the raw data URL.
 *
 * A 2160px PNG is several megabytes of base64; handing that string to an
 * anchor makes the browser re-parse it on click, and Safari in particular
 * treats a large `data:` navigation as something it can quietly drop. A blob
 * is already decoded bytes, so the click is cheap and both files can be
 * fired in the same tick.
 */
function anchorDownload(blobUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, encoded] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(header)?.[1] ?? "image/png";
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

/** True when the browser can share actual image files, not just links. */
function canShareFiles(files: File[]): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    typeof navigator.share === "function" &&
    navigator.canShare({ files })
  );
}

/**
 * Whether the share sheet is the right answer, rather than merely available.
 *
 * Only phones and tablets. macOS browsers advertise file sharing too, but a
 * desktop share sheet is a poor way to post to X compared with the composer
 * opening in a tab, so desktop takes the intent route regardless.
 */
function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as a Mac; the touch check separates it from a desktop.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return isIOS || (window.matchMedia?.("(pointer: coarse)").matches ?? false);
}

function dataUrlToBlobUrl(dataUrl: string): string {
  const [header, encoded] = dataUrl.split(",");
  const mime = /:(.*?);/.exec(header)?.[1] ?? "image/png";
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

/** Frees the object URLs once the browser has had time to start the saves. */
function releaseLater(urls: string[]) {
  setTimeout(() => urls.forEach((u) => URL.revokeObjectURL(u)), 60_000);
}

export interface SummitAssets {
  pfpDataUrl: string;
  cardDataUrl: string;
}

/**
 * Saves both assets straight to the device.
 *
 * Both saves fire in the same tick, inside the click that asked for them, so
 * the two files arrive together and neither falls outside the gesture the
 * browser is willing to honour.
 */
export function saveAssets({ pfpDataUrl, cardDataUrl }: SummitAssets): void {
  const pfpUrl = dataUrlToBlobUrl(pfpDataUrl);
  const cardUrl = dataUrlToBlobUrl(cardDataUrl);
  anchorDownload(pfpUrl, "solana-summit-nigeria-pfp.png");
  anchorDownload(cardUrl, "solana-summit-nigeria-attending-card.png");
  releaseLater([pfpUrl, cardUrl]);
}

/**
 * Posts the card to X.
 *
 * On a phone the OS share sheet is used and the card goes with it, so
 * choosing X there opens the composer with the image already attached --
 * the only way to get a picture into the post, since X's web intent takes
 * text and a URL and nothing else.
 *
 * Everywhere else the composer opens in a tab with the copy filled in and
 * the card is saved alongside, ready to attach in one click.
 */
export function shareToX({ cardDataUrl }: SummitAssets): void {
  if (isTouchDevice()) {
    const card = dataUrlToFile(cardDataUrl, "solana-summit-nigeria-attending-card.png");
    if (canShareFiles([card])) {
      navigator
        .share({ files: [card], text: `${SHARE_TEXT}\n${SITE_URL}` })
        .catch((error: DOMException) => {
          // Dismissing the sheet is a decision, not a failure -- doing
          // anything after it would be acting against the user. Any other
          // error means the sheet never worked, so fall back to the composer.
          if (error?.name !== "AbortError") openComposerAndSaveCard(cardDataUrl);
        });
      return;
    }
  }

  openComposerAndSaveCard(cardDataUrl);
}

function openComposerAndSaveCard(cardDataUrl: string) {
  /*
    Opened first and synchronously. Popup blockers judge a window by how
    directly it follows the click, so anything slower in front of it -- like
    decoding a multi-megabyte PNG -- gets the tab blocked.
  */
  const intent = new URL("https://x.com/intent/tweet");
  intent.searchParams.set("text", SHARE_TEXT);
  intent.searchParams.set("url", SITE_URL);
  window.open(intent.toString(), "_blank", "noopener,noreferrer");

  // Then save the card, so it is waiting in downloads ready to attach.
  const cardUrl = dataUrlToBlobUrl(cardDataUrl);
  anchorDownload(cardUrl, "solana-summit-nigeria-attending-card.png");
  releaseLater([cardUrl]);
}

export { REGISTER_URL };
