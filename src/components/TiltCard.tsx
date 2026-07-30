import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import "./TiltCard.css";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  maxTilt?: number;
}

/**
 * Wraps its children with a subtle mouse-tracking 3D tilt + soft highlight,
 * spring-smoothed so it feels alive rather than snapping straight to the
 * cursor. Pointer-fine/hover-capable devices only -- touch just gets the
 * plain element.
 */
export function TiltCard({ children, className, style, maxTilt = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, { stiffness: 200, damping: 20, mass: 0.4 });
  const spy = useSpring(py, { stiffness: 200, damping: 20, mass: 0.4 });

  const rotateX = useTransform(spy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(spx, [0, 1], [-maxTilt, maxTilt]);
  const glowX = useTransform(spx, [0, 1], ["10%", "90%"]);
  const glowY = useTransform(spy, [0, 1], ["10%", "90%"]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt-card${className ? ` ${className}` : ""}`}
      style={{ rotateX, rotateY, transformPerspective: 900, ...style }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
      <motion.div
        className="tilt-card__glow"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.18), transparent 60%)`,
          ),
        }}
      />
    </motion.div>
  );
}
