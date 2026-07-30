import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

import { IntroAnimation } from "./components/IntroAnimation";
import { PatternBackground } from "./components/PatternBackground";
import { AnnouncementBanner } from "./components/AnnouncementBanner";
import { Hero } from "./components/Hero";
import { Footer } from "./components/Footer";
import { UploadDetails } from "./components/UploadDetails";
import { GenerationOverlay } from "./components/GenerationOverlay";
import { ResultReveal } from "./components/ResultReveal";

import { detectFocalPoint, loadImage, type FocalPoint } from "./lib/faceCrop";
import { generatePfp } from "./lib/pfpGenerator";
import { generateAttendeeCard } from "./lib/attendeeCardGenerator";
import { resizeThumbnail } from "./lib/thumbnail";
import { fetchFeed, reportGenerated } from "./lib/api";

type Stage = "intro" | "landing" | "details" | "generating" | "result";

const CONFETTI_COLORS = ["#89de66", "#95f26e", "#cbfff6", "#023a50"];

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

function fireConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: CONFETTI_COLORS,
    ticks: 200,
    gravity: 1,
    drift: 0,
    startVelocity: 45,
    scalar: 1.1,
  });
  setTimeout(() => {
    confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0 }, colors: CONFETTI_COLORS });
    confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1 }, colors: CONFETTI_COLORS });
  }, 100);
}

// Minimum time each generation step stays visible, so the transition reads
// as a deliberate, premium moment rather than a flash even when the actual
// canvas work finishes instantly.
const STEP_MIN_MS = 550;
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

  useEffect(() => {
    fetchFeed().then(setFeed);
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
      generateAttendeeCard({ photo: photoEl, focal, name: name.trim(), role: role.trim(), pfpDataUrl: pfp }),
      wait(STEP_MIN_MS),
    ]);
    setCardDataUrl(card);

    setStage("result");

    try {
      const thumbnail = await resizeThumbnail(pfp);
      const updated = await reportGenerated(thumbnail);
      setFeed(updated);
    } catch (error) {
      console.log("Failed to report generated identity:", error);
    }
  };

  const handleDownloadPfp = () => {
    if (!pfpDataUrl) return;
    fireConfetti();
    downloadDataUrl(pfpDataUrl, "solana-summit-nigeria-pfp.png");
  };

  const handleDownloadCard = () => {
    if (!cardDataUrl) return;
    fireConfetti();
    downloadDataUrl(cardDataUrl, "solana-summit-nigeria-attending-card.png");
  };

  const handleDownloadBoth = () => {
    if (!pfpDataUrl || !cardDataUrl) return;
    fireConfetti();
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

          <AnimatePresence mode="wait">
            {stage === "landing" && (
              <Hero
                key="hero"
                attendeeCount={feed.count}
                recentAvatars={feed.recent}
                onUploadClick={openFilePicker}
              />
            )}

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

            {stage === "result" && pfpDataUrl && cardDataUrl && (
              <ResultReveal
                key="result"
                pfpDataUrl={pfpDataUrl}
                cardDataUrl={cardDataUrl}
                onDownloadPfp={handleDownloadPfp}
                onDownloadCard={handleDownloadCard}
                onDownloadBoth={handleDownloadBoth}
                onReset={resetFlow}
              />
            )}
          </AnimatePresence>

          {(stage === "landing" || stage === "result") && <Footer />}
        </>
      )}

      <AnimatePresence>
        {stage === "generating" && <GenerationOverlay key="gen" currentStep={genStep} />}
      </AnimatePresence>
    </div>
  );
}
