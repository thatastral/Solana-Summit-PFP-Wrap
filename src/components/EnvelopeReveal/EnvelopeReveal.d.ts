import type { CSSProperties, HTMLAttributes } from "react";

export type RevealStage =
  | "idle"
  | "entrance"
  | "opening"
  | "card"
  | "focus"
  | "pfp"
  | "complete";

export interface RevealTimings {
  entrance?: number;
  opening?: number;
  card?: number;
  focus?: number;
  pfp?: number;
}

export interface EnvelopeRevealHandle {
  replay: () => void;
  stage: RevealStage;
  isComplete: boolean;
}

export interface EnvelopeRevealProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onAnimationStart"> {
  /** Data URL or src of the generated attendee card. */
  attendeeCard?: string;
  /** Data URL or src of the generated wrapped PFP. */
  wrappedPFP?: string;
  userName?: string;
  userRole?: string;
  autoPlay?: boolean;
  onComplete?: () => void;
  onStageChange?: (stage: RevealStage) => void;
  /** Image URL or any CSS background shorthand. */
  background?: string;
  speed?: number;
  timings?: RevealTimings;
  showCaption?: boolean;
  showReplayButton?: boolean;
  parallax?: boolean;
  /** Fine-tunes how far the card rests out of the pocket. */
  cardRestOffset?: number;
  sound?: boolean;
  volume?: number;
  className?: string;
  style?: CSSProperties;
  cardAlt?: string;
  pfpAlt?: string;
}

declare const EnvelopeReveal: React.ForwardRefExoticComponent<
  EnvelopeRevealProps & React.RefAttributes<EnvelopeRevealHandle>
>;

export default EnvelopeReveal;
