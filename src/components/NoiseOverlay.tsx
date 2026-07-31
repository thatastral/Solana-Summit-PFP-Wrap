import "./NoiseOverlay.css";

/**
 * Film-grain overlay that sits above every other layer, matching the Figma
 * noise effect (Mono, 1px, 100% density, #000000 at 15%). Purely decorative
 * and never interactive, so it can safely sit at the very top of the stack.
 */
export function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden="true" />;
}
