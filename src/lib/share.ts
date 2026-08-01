import { REGISTER_URL } from "../config";

/**
 * Saving and sharing the generated assets.
 *
 * iOS Safari is the reason this file exists. It ignores the `download`
 * attribute on an anchor, so the plain approach opens the PNG in place and
 * loses the page — and it will only honour one programmatic download per
 * gesture, which breaks saving two files at once. On iOS the reliable path
 * is the native share sheet, which saves straight to Photos.
 */

const SITE_URL =
  typeof window !== "undefined" ? window.location.origin : "https://solana-summit26-pfp-wrap.vercel.app";

export const SHARE_TEXT = `Just reserved my spot at Solana Summit Nigeria.

Create your official Summit identity 👇`;

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

export const IS_IOS =
  typeof navigator !== "undefined" &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as a Mac; the touch check separates it from a desktop.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

/**
 * Whether the share sheet is the right answer, rather than merely available.
 *
 * On a phone it is: it is the only thing that reliably saves to Photos on
 * iOS. On desktop it is not -- macOS browsers advertise file sharing, so a
 * plain "Download" would open a share sheet the user never asked for, and
 * dismissing it leaves them with nothing. Desktop always downloads.
 */
function prefersNativeShare(): boolean {
  if (typeof window === "undefined") return false;
  if (IS_IOS) return true;
  return window.matchMedia?.("(pointer: coarse)").matches ?? false;
}

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
 * Saves both assets. Uses the native share sheet where files are supported
 * (which is what actually works on iOS), and falls back to two anchor
 * downloads elsewhere.
 *
 * Resolves `true` if the assets were handed off, `false` if the user
 * dismissed the share sheet.
 */
export async function saveAssets({ pfpDataUrl, cardDataUrl }: SummitAssets): Promise<boolean> {
  if (prefersNativeShare()) {
    // Decoding two full-size PNGs is not cheap, so it only happens on the
    // path that actually needs File objects.
    const files = [
      dataUrlToFile(pfpDataUrl, "solana-summit-nigeria-pfp.png"),
      dataUrlToFile(cardDataUrl, "solana-summit-nigeria-attending-card.png"),
    ];

    if (canShareFiles(files)) {
      try {
        await navigator.share({ files, title: "Solana Summit Nigeria" });
        return true;
      } catch (error) {
        // AbortError means the user closed the sheet -- not a failure, and
        // it must not fall through to a download they didn't ask for.
        if ((error as DOMException)?.name === "AbortError") return false;
      }
    }
  }

  // Both saves fire in the same tick, so the two files arrive together
  // rather than one after the other.
  const pfpUrl = dataUrlToBlobUrl(pfpDataUrl);
  const cardUrl = dataUrlToBlobUrl(cardDataUrl);
  anchorDownload(pfpUrl, "solana-summit-nigeria-pfp.png");
  anchorDownload(cardUrl, "solana-summit-nigeria-attending-card.png");
  releaseLater([pfpUrl, cardUrl]);
  return true;
}

/**
 * Posts to X with the copy pre-filled.
 *
 * X's web intent takes text and a URL only -- it cannot carry an image, and
 * nothing in the browser can attach one to it. So where the native share
 * sheet can carry files (mobile), that is used and the user picks X from it,
 * which does attach the card. Everywhere else the intent opens with the copy
 * ready and the card is saved alongside so it can be attached in one tap.
 */
export async function shareToX({ pfpDataUrl, cardDataUrl }: SummitAssets): Promise<void> {
  if (prefersNativeShare()) {
    const card = dataUrlToFile(cardDataUrl, "solana-summit-nigeria-attending-card.png");
    if (canShareFiles([card])) {
      try {
        await navigator.share({
          files: [card],
          text: `${SHARE_TEXT}\n${SITE_URL}`,
          title: "Solana Summit Nigeria",
        });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === "AbortError") return;
      }
    }
  }

  /*
    Opened first and synchronously. Popup blockers judge a window by how
    directly it follows the click, so anything slower in front of it -- like
    building a File -- gets the tab blocked.
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
