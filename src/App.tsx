import { useState, useRef, useEffect } from "react";
import svgPaths from "./imports/svg-qobsxijuss";
import imgRectangle2 from "figma:asset/dc7d0035fd5cce1df3621859e490d9db68e1f23e.png";
import { PFPFramePreview } from "./components/PFPFramePreview";
import { PFPFrameGenerator } from "./components/PFPFrameGenerator";
import { Volume2, VolumeX, Timer, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { projectId, publicAnonKey } from "./utils/supabase/info";

function Frame22() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(1812px,200vw)] h-[min(1812px,200vw)] z-0 pointer-events-none">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="size-full"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1813 1813"
        >
          <g id="Frame 2147224025">
            <g id="Vector" opacity="0.7">
              <path d={svgPaths.p34295900} fill="url(#paint0_radial_25_71)" />
              <path d={svgPaths.pc15f800} fill="url(#paint1_radial_25_71)" />
              <path d={svgPaths.p10a9f700} fill="url(#paint2_radial_25_71)" />
              <path d={svgPaths.p1e7982f0} fill="url(#paint3_radial_25_71)" />
              <path d={svgPaths.p35fec80} fill="url(#paint4_radial_25_71)" />
              <path d={svgPaths.p981180} fill="url(#paint5_radial_25_71)" />
              <path d={svgPaths.p2acb0180} fill="url(#paint6_radial_25_71)" />
              <path d={svgPaths.p3d2ce400} fill="url(#paint7_radial_25_71)" />
              <path d={svgPaths.p1ce98f0} fill="url(#paint8_radial_25_71)" />
              <path d={svgPaths.p3729d180} fill="url(#paint9_radial_25_71)" />
              <path d={svgPaths.p27a7ed70} fill="url(#paint10_radial_25_71)" />
              <path d={svgPaths.p17e6cf80} fill="url(#paint11_radial_25_71)" />
              <path d={svgPaths.p26113a00} fill="url(#paint12_radial_25_71)" />
              <path d={svgPaths.p100d8300} fill="url(#paint13_radial_25_71)" />
              <path d={svgPaths.padcf480} fill="url(#paint14_radial_25_71)" />
              <path d={svgPaths.p2ee89400} fill="url(#paint15_radial_25_71)" />
              <path d={svgPaths.p28b6ca80} fill="url(#paint16_radial_25_71)" />
              <path d={svgPaths.p3bce0800} fill="url(#paint17_radial_25_71)" />
              <path d={svgPaths.p27f4a80} fill="url(#paint18_radial_25_71)" />
              <path d={svgPaths.p1d8e5900} fill="url(#paint19_radial_25_71)" />
              <path d={svgPaths.p37db4b00} fill="url(#paint20_radial_25_71)" />
              <path d={svgPaths.p34b7b180} fill="url(#paint21_radial_25_71)" />
              <path d={svgPaths.p3d62bd00} fill="url(#paint22_radial_25_71)" />
              <path d={svgPaths.p89b6400} fill="url(#paint23_radial_25_71)" />
            </g>
          </g>
          <defs>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint0_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint1_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint2_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint3_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint4_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint5_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint6_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint7_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint8_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint9_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint10_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint11_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint12_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint13_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint14_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint15_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint16_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint17_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint18_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint19_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint20_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint21_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint22_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(906.015 906.241) rotate(120) scale(853.915 853.082)"
              gradientUnits="userSpaceOnUse"
              id="paint23_radial_25_71"
              r="1"
            >
              <stop stopColor="#D0EEF6" stopOpacity="0.28" />
              <stop offset="1" stopColor="#D0EEF6" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}

function UkgvMPt5S8YqsVoIBs5ZUywEy() {
  return (
    <div className="h-[40px] md:h-[54.032px] relative shrink-0 w-[107px] md:w-[144px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 144 55"
      >
        <g clipPath="url(#clip0_2_125)" id="UkgvMPt5s8YQSVoIBs5zUywEy10 2">
          <g id="Vector">
            <path d={svgPaths.p14dcd3c0} fill="var(--fill-0, white)" />
            <path d={svgPaths.p18a38c80} fill="var(--fill-0, white)" />
            <path d={svgPaths.p344c1f80} fill="var(--fill-0, white)" />
            <path d={svgPaths.p3e61e200} fill="var(--fill-0, white)" />
            <path d={svgPaths.p3344e400} fill="var(--fill-0, white)" />
            <path d={svgPaths.p35048b00} fill="var(--fill-0, white)" />
          </g>
          <path
            clipRule="evenodd"
            d={svgPaths.p2072840}
            fill="var(--fill-0, white)"
            fillRule="evenodd"
            id="Vector_2"
          />
          <path
            d={svgPaths.p28229e00}
            fill="var(--fill-0, white)"
            id="Exclude"
          />
        </g>
        <defs>
          <clipPath id="clip0_2_125">
            <rect fill="white" height="54.0321" width="144" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+20px)] w-full h-full pointer-events-none scale-[1.5] md:scale-[1.8]">
      <div
        className="absolute bg-gradient-to-b from-[40.864%] from-[rgba(199,234,253,0)] inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[center] mask-size-[contain] to-[190.66%] to-[rgba(199,234,253,0.2)]"
        style={{ maskImage: `url('${imgRectangle2}')` }}
      />
    </div>
  );
}

export default function App() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [generatedFrame, setGeneratedFrame] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Countdown timer effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date("2025-11-03T09:00:00").getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch frame count on load
  useEffect(() => {
    const fetchFrameCount = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07da931a/frames/count`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        const data = await response.json();
        if (data.count !== undefined) {
          setDownloadCount(data.count);
        }
      } catch (error) {
        console.log("Failed to fetch frame count:", error);
      }
    };

    fetchFrameCount();
  }, []);

  // Audio autoplay effect
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
        try {
          await audioRef.current.play();
          setIsMuted(false);
        } catch (error) {
          console.log("Autoplay prevented:", error);
          const handleFirstInteraction = async () => {
            if (audioRef.current && audioRef.current.paused) {
              try {
                await audioRef.current.play();
                setIsMuted(false);
              } catch (err) {
                console.log("Failed to play audio:", err);
              }
            }
            document.removeEventListener("click", handleFirstInteraction);
          };
          document.addEventListener("click", handleFirstInteraction);
        }
      }
    };

    playAudio();
  }, []);

  const handleDownload = async () => {
    if (generatedFrame && profileImage) {
      // Trigger blue confetti with Solana brand colors
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4ca8cf", "#C7EAFD", "#D0EEF6", "#76a8c0", "#9fd3ed"],
        ticks: 200,
        gravity: 1,
        drift: 0,
        startVelocity: 45,
        scalar: 1.2,
      });

      // Trigger a second burst for more effect
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#4ca8cf", "#C7EAFD", "#D0EEF6", "#76a8c0", "#9fd3ed"],
        });
      }, 100);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#4ca8cf", "#C7EAFD", "#D0EEF6", "#76a8c0", "#9fd3ed"],
        });
      }, 100);

      // Increment frame count in database
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07da931a/frames/increment`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        const data = await response.json();
        if (data.count !== undefined) {
          setDownloadCount(data.count);
        }
      } catch (error) {
        console.log("Failed to increment frame count:", error);
      }

      // Download after a brief delay to let confetti start
      setTimeout(() => {
        const link = document.createElement("a");
        link.download = `solana-summit-pfp.png`;
        link.href = generatedFrame;
        link.click();
      }, 300);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="bg-[#4ca8cf] min-h-screen overflow-x-hidden relative w-full">
      {/* Background Audio */}
      <audio ref={audioRef} loop preload="auto" style={{ display: "none" }}>
        <source src="/SSummitSong.mp3" type="audio/mpeg" />
      </audio>

      <Frame22 />

      {/* Background Decorative SVG */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <svg
          className="w-full h-full max-w-[1312px]"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 1312 1474"
        >
          <path
            d={svgPaths.p36685800}
            fill="var(--fill-0, #C7EAFD)"
            fillOpacity="0.15"
            id="Vector 1"
          />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-4 md:px-8 lg:px-[120px] py-6 md:py-8 lg:py-12">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <UkgvMPt5S8YqsVoIBs5ZUywEy />
            <div className="flex gap-2 md:gap-[8px] items-center">
              <a
                href="https://luma.com/bu4glypq?tk=QubwtN"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[rgba(199,234,253,0.32)] box-border flex gap-[10px] h-[36px] md:h-[44px] hover:bg-[rgba(199,234,253,0.4)] items-center justify-center overflow-clip px-4 md:px-[24px] py-[10px] md:py-[15px] rounded-[12px] md:rounded-[16px] transition-colors"
              >
                <p className="font-['Clash_Grotesk:Regular',_sans-serif] leading-none not-italic text-[16px] md:text-[20px] text-center text-nowrap text-white whitespace-pre font-[Clash_Grotesk]">
                  Register
                </p>
              </a>
              <button
                onClick={toggleAudio}
                className="bg-[#c7eafd] box-border flex gap-[10px] hover:bg-[#b0e0f5] items-center justify-center overflow-clip p-[6px] md:p-[8px] rounded-[12px] md:rounded-[16px] size-[36px] md:size-[44px] transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="text-[#4ca8cf] w-[20px] h-[20px] md:w-[24px] md:h-[24px]" />
                ) : (
                  <Volume2 className="text-[#4ca8cf] w-[20px] h-[20px] md:w-[24px] md:h-[24px]" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="w-full px-4 md:px-8 flex items-center justify-center gap-2 md:gap-[14px] mb-6 md:mb-8">
          <div className="bg-[#2e84a8] box-border flex gap-[4px] items-center justify-center overflow-clip p-2 md:p-[12px] rounded-[100px]">
            <Timer className="text-[#c7eafd] w-[14px] h-[14px] md:w-[18px] md:h-[18px]" />
            <p className="font-['Clash_Grotesk:Regular',_sans-serif] leading-none not-italic text-[11px] md:text-[14px] text-center text-nowrap text-white whitespace-pre">
              <span>{String(timeLeft.days).padStart(2, "0")} </span>
              <span className="text-[rgba(255,255,255,0.6)] font-[Clash_Grotesk]">d</span>
              <span className="font-[Clash_Grotesk]"> : {String(timeLeft.hours).padStart(2, "0")} </span>
              <span className="text-[rgba(255,255,255,0.6)] font-[Clash_Grotesk]">h</span>
              <span className="font-[Clash_Grotesk]"> : {String(timeLeft.minutes).padStart(2, "0")} </span>
              <span className="text-[rgba(255,255,255,0.6)] font-[Clash_Grotesk]">m</span>
              <span className="font-[Clash_Grotesk]"> : {String(timeLeft.seconds).padStart(2, "0")} </span>
              <span className="text-[rgba(255,255,255,0.6)]">s</span>
            </p>
          </div>
          <div className="bg-[#2e84a8] box-border flex gap-[4px] items-center justify-center overflow-clip p-2 md:p-[12px] rounded-[100px]">
            <Sparkles className="text-[#c7eafd] w-[14px] h-[14px] md:w-[18px] md:h-[18px]" />
            <p className="font-['Clash_Grotesk:Regular',_sans-serif] leading-none not-italic text-[11px] md:text-[14px] text-center text-nowrap text-white whitespace-pre">
              <span>{downloadCount} </span>
              <span className="text-[rgba(255,255,255,0.6)] font-[Clash_Grotesk]">Frames Generated</span>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 w-full px-4 md:px-8 pb-8">
          <div className="max-w-[639px] mx-auto flex flex-col gap-8 md:gap-[56px] items-center">
            {/* Hero Text */}
            <div className="flex flex-col gap-4 md:gap-[22px] items-center text-center w-full">
              <h1 className="font-['Clash_Grotesk:Medium',_sans-serif] leading-[1.1] text-[28px] sm:text-[36px] md:text-[42px] lg:text-[52px] xl:text-[63px] text-white font-[Clash_Grotesk] font-bold px-4 max-w-[95%] sm:max-w-[85%] md:max-w-[700px] lg:max-w-[900px]">
                Wrap Your PFP<br /><span className="md:whitespace-nowrap">for Solana Summit Africa</span>
              </h1>
              <p className="font-['Clash_Grotesk:Regular',_sans-serif] leading-[1.3] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px] text-[rgba(255,255,255,0.8)] max-w-[90%] sm:max-w-[480px] md:max-w-[520px] lg:max-w-[537px] font-[Clash_Grotesk] px-4">
                Show your excitement for the summit with a custom Solana Summit
                Africa-themed frame.
              </p>
            </div>

            {/* PFP Frame Section */}
            <div className="w-full max-w-[548px] mx-auto">
              <div className="relative">
                {/* Background decorative border */}
                <div className="absolute inset-0 p-[1px] -m-[1px]">
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 549 597"
                  >
                    <path
                      d={svgPaths.p104e5480}
                      fill="var(--fill-0, #C7EAFD)"
                      fillOpacity="0.3"
                      id="Vector 1"
                      stroke="var(--stroke-0, #C7EAFD)"
                    />
                  </svg>
                </div>

                {/* Content */}
                <div className="relative flex flex-col gap-4 md:gap-[24px] items-center p-6 md:p-9">
                  <PFPFramePreview
                    profileImage={profileImage}
                    onImageChange={setProfileImage}
                  />

                  <div className="flex items-center justify-center w-full">
                    <button
                      onClick={handleDownload}
                      disabled={!profileImage}
                      className="bg-white box-border flex gap-[4px] hover:bg-white/90 items-center justify-center overflow-clip px-4 md:px-[14px] py-3 md:py-[13px] rounded-[12px] md:rounded-[16px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      <svg className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]" fill="none" viewBox="0 0 18 18">
                        <path
                          clipRule="evenodd"
                          d={svgPaths.p307dd600}
                          fill="var(--fill-0, #4CA8CF)"
                          fillRule="evenodd"
                        />
                      </svg>
                      <p className="font-['Clash_Grotesk:Regular',_sans-serif] leading-none not-italic text-[#4ca8cf] text-[12px] md:text-[14px] text-center text-nowrap whitespace-pre font-[Clash_Grotesk]">
                        Download
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Registration CTA */}
        <div className="w-full px-4 md:px-8 lg:px-[120px] py-8 md:py-12">
          <div className="max-w-[1028px] mx-auto bg-[#2e84a8] box-border flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 overflow-clip p-6 md:p-[40px] rounded-[12px] md:rounded-[14.453px] relative">
            <div className="flex flex-col gap-3 md:gap-[12px] items-start justify-center text-center md:text-left w-full md:w-auto">
              <p className="font-['Clash_Grotesk:Medium',_sans-serif] leading-none text-[24px] md:text-[32px] lg:text-[36px] text-white w-full">
                <span className="font-['Clash_Grotesk:Regular',_sans-serif] not-italic font-[Clash_Grotesk]">
                  Still not ready for{" "}
                </span>
                <span className="font-['Clash_Grotesk:Medium',_sans-serif] font-[Clash_Grotesk] font-bold">#SolanaSummitAfrica?</span>
              </p>
              <p className="font-['Clash_Grotesk:Regular',_sans-serif] leading-[1.2] text-[16px] md:text-[20px] lg:text-[22px] text-[rgba(255,255,255,0.8)] max-w-[668px] font-[Clash_Grotesk]">
                Register now and join thousands of builders, creators, and degens.
              </p>
            </div>
            <a
              href="https://luma.com/bu4glypq?tk=QubwtN"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[rgba(199,234,253,0.32)] box-border flex gap-[10px] h-[40px] md:h-[44px] hover:bg-[rgba(199,234,253,0.4)] items-center justify-center overflow-clip px-5 md:px-[24px] py-[12px] md:py-[15px] rounded-[12px] md:rounded-[16px] transition-colors shrink-0"
            >
              <p className="font-['Clash_Grotesk:Regular',_sans-serif] leading-none not-italic text-[16px] md:text-[20px] text-center text-nowrap text-white whitespace-pre font-[Clash_Grotesk]">
                Register
              </p>
            </a>
            <MaskGroup />
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full px-4 md:px-8 lg:px-[120px] py-6 md:py-8 pb-14">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <p className="font-['Clash_Grotesk:Regular',_sans-serif] leading-[1.2] text-[14px] md:text-[18px] lg:text-[20px] text-[rgba(255,255,255,0.8)] text-center md:text-left">
              <span className="font-[Clash_Grotesk]">Built for the Solana community by </span>
              <a
                href="https://x.com/thatastral"
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Clash_Grotesk:Bold',_sans-serif] hover:text-white not-italic transition-colors font-[Clash_Grotesk]"
              >
                Astral
              </a>
            </p>
            <p className="font-['Clash_Grotesk:Regular',_sans-serif] leading-[1.2] text-[14px] md:text-[18px] lg:text-[20px] text-[rgba(255,255,255,0.8)] text-center md:text-right font-[Clash_Grotesk]">
              See you at the summit!
            </p>
          </div>
        </footer>
      </div>

      {/* PFP Frame Generator */}
      <PFPFrameGenerator
        profileImage={profileImage}
        onGenerated={setGeneratedFrame}
      />
    </div>
  );
}
