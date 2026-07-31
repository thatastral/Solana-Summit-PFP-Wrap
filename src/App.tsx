import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";

import { IntroAnimation } from "./components/IntroAnimation";
import { PatternBackground } from "./components/PatternBackground";
import { AnnouncementBanner } from "./components/AnnouncementBanner";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { UploadDetails } from "./components/UploadDetails";
import { GenerationOverlay } from "./components/GenerationOverlay";
import { ResultReveal } from "./components/ResultReveal";
import { NoiseOverlay } from "./components/NoiseOverlay";
import { MusicToggle } from "./components/MusicToggle";

import { detectFocalPoint, loadImage, type FocalPoint } from "./lib/faceCrop";
import { generatePfp } from "./lib/pfpGenerator";
import { generateAttendeeCard } from "./lib/attendeeCardGenerator";
import { resizeThumbnail } from "./lib/thumbnail";
import { fetchFeed, reportGenerated } from "./lib/api";
import { IS_PRODUCTION } from "./config";
import { playUiSound, unlockUiSounds } from "./lib/uiSounds";

type Stage = "intro" | "landing" | "details" | "generating" | "result";

/** Resolves once the browser has actually decoded the image. */
function decodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
    img.decode?.().then(resolve, () => {});
  });
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

// Minimum time each generation step stays on screen. Long enough to read
// the line once the crossfade settles, short enough that three of them pass
// in well under three seconds.
const STEP_MIN_MS = 1150;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [stage, setStage] = useState<Stage>("intro");
  const [feed, setFeed] = useState<{ count: number; recent: string[] }>({ count: 0, recent: [] });

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoEl, setPhotoEl] = useState<HTMLImageElement | null>(null);
  const [focal, setFocal] = useState<FocalPoint>({ x: 0.5, y: 0.38 });
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [genStep, setGenStep] = useState(0);
  const [pfpDataUrl, setPfpDataUrl] = useState<string | null>(null);
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /*
    One delegated listener covers every pressable on the site, so interface
    audio never has to be remembered at each call site. Elements opt into a
    different cue with `data-sound`; everything else gets the default tap.
    Capture phase, so it still fires if a handler stops propagation.
  */
  useEffect(() => {
    const onPress = (event: PointerEvent) => {
      unlockUiSounds();
      const target = event.target as HTMLElement | null;
      const pressable = target?.closest?.("button, a[href], label, input[type='file']");
      if (!pressable) return;
      playUiSound((pressable.getAttribute("data-sound") as never) || "tap");
    };

    const onKey = (event: KeyboardEvent) => {
      unlockUiSounds();
      if (event.key !== "Enter" && event.key !== " ") return;
      const el = document.activeElement as HTMLElement | null;
      if (!el?.matches?.("button, a[href]")) return;
      playUiSound((el.getAttribute("data-sound") as never) || "tap");
    };

    document.addEventListener("pointerdown", onPress, { capture: true });
    document.addEventListener("keydown", onKey, { capture: true });
    return () => {
      document.removeEventListener("pointerdown", onPress, { capture: true });
      document.removeEventListener("keydown", onKey, { capture: true });
    };
  }, []);

  // Poll every second so the counter and the "Faces of Solana Summit
  // Nigeria" strip stay live as other people generate their assets.
  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetchFeed().then((next) => {
        if (!cancelled) setFeed(next);
      });
    };

    load();
    const timer = setInterval(load, 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      const img = await loadImage(dataUrl);
      const focalPoint = await detectFocalPoint(img);
      setPhotoUrl(dataUrl);
      setPhotoEl(img);
      setFocal(focalPoint);
      setStage("details");
    };
    reader.readAsDataURL(file);
  };

  const resetFlow = () => {
    setPhotoUrl(null);
    setPhotoEl(null);
    setName("");
    setRole("");
    setPfpDataUrl(null);
    setCardDataUrl(null);
    setGenStep(0);
    setStage("landing");
  };

  const handleGenerate = async () => {
    if (!photoEl) return;
    setStage("generating");

    setGenStep(0);
    await wait(STEP_MIN_MS);

    setGenStep(1);
    const [pfp] = await Promise.all([generatePfp(photoEl, focal), wait(STEP_MIN_MS)]);
    setPfpDataUrl(pfp);

    setGenStep(2);
    const [card] = await Promise.all([
      generateAttendeeCard({ photo: photoEl, focal, name: name.trim(), role: role.trim() }),
      wait(STEP_MIN_MS),
    ]);
    setCardDataUrl(card);

    // Decode both before the reveal mounts. Starting the envelope sequence
    // against undecoded images makes the card pop in mid-slide.
    await Promise.all([pfp, card].map(decodeImage));

    setStage("result");

    // Local/preview runs must not inflate the public counter or gallery.
    if (!IS_PRODUCTION) return;

    try {
      const thumbnail = await resizeThumbnail(pfp);
      const updated = await reportGenerated(thumbnail);
      setFeed(updated);
    } catch (error) {
      console.log("Failed to report generated identity:", error);
    }
  };

  const handleDownloadBoth = () => {
    if (!pfpDataUrl || !cardDataUrl) return;
    downloadDataUrl(pfpDataUrl, "solana-summit-nigeria-pfp.png");
    setTimeout(() => downloadDataUrl(cardDataUrl, "solana-summit-nigeria-attending-card.png"), 250);
  };

  return (
    <div className="app-shell">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      <AnimatePresence>
        {stage === "intro" && <IntroAnimation onComplete={() => setStage("landing")} />}
      </AnimatePresence>

      {stage !== "intro" && (
        <>
          <PatternBackground variant={stage === "result" ? "result" : "hero"} />

          {(stage === "landing" || stage === "details") && <AnnouncementBanner />}

          <main
            className={`app-shell__main${stage === "result" ? " app-shell__main--centered" : ""}`}
          >
            <AnimatePresence mode="wait">
              {stage === "landing" && (
                <Hero
                  key="hero"
                  attendeeCount={feed.count}
                  recentAvatars={feed.recent}
                  onUploadClick={openFilePicker}
                />
              )}

              {stage === "result" && pfpDataUrl && cardDataUrl && (
                <ResultReveal
                  key="result"
                  pfpDataUrl={pfpDataUrl}
                  cardDataUrl={cardDataUrl}
                  userName={name.trim()}
                  userRole={role.trim()}
                  onDownloadBoth={handleDownloadBoth}
                  onReset={resetFlow}
                />
              )}
            </AnimatePresence>
          </main>

          {/* Overlay -- lives outside the flex flow so it can cover the page. */}
          <AnimatePresence>
            {stage === "details" && photoUrl && (
              <UploadDetails
                key="details"
                previewUrl={photoUrl}
                focalPoint={focal}
                name={name}
                role={role}
                onNameChange={setName}
                onRoleChange={setRole}
                onChangePhoto={openFilePicker}
                onSubmit={handleGenerate}
                onCancel={resetFlow}
              />
            )}
          </AnimatePresence>

          {stage === "landing" && <Footer />}
        </>
      )}

      <AnimatePresence>
        {stage === "generating" && <GenerationOverlay key="gen" currentStep={genStep} />}
      </AnimatePresence>

      {/* Mounted from first paint so the music starts with the intro; the
          intro overlay covers it visually until the landing page appears.
          Hidden on the result screen so the reveal stands alone -- audio
          keeps playing, only the control is out of the way. */}
      <MusicToggle hidden={stage === "result"} />

      <NoiseOverlay />
    </div>
  );
}
