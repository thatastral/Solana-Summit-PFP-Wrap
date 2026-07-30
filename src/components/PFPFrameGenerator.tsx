import { useRef, useEffect } from "react";
import circularTextImg from "figma:asset/487bc72f6682897b9a66fcf09a3d8e934790eecb.png";

interface PFPFrameGeneratorProps {
  profileImage: string | null;
  onGenerated: (dataUrl: string) => void;
}

export function PFPFrameGenerator({
  profileImage,
  onGenerated,
}: PFPFrameGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !profileImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to optimal Twitter PFP dimensions (400x400)
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Fill with background color matching design (#c7eafd)
      ctx.fillStyle = "#c7eafd";
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();

      // Clip to circle for the profile image
      ctx.save();
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      // Draw the profile image with object-cover behavior (centered and cropped)
      const scale = Math.max(size / img.width, size / img.height);
      const x = (size / 2) - (img.width / 2) * scale;
      const y = (size / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();

      // Load and draw the circular text PNG
      const textImage = new Image();
      textImage.crossOrigin = "anonymous";
      textImage.onload = () => {
        // Clip to circle to prevent the PNG from bleeding out
        ctx.save();
        ctx.beginPath();
        // Circle radius is 200px (half of 400px canvas)
        // Adjust center by 2px down and 1px left to match preview positioning
        ctx.arc(size / 2 - (1 * 400/216), size / 2 + (2 * 400/216), size / 2, 0, Math.PI * 2);
        ctx.clip();
        
        // PNG is 234px for a 216px circle
        // Scale proportionally for 400px canvas: 234/216 * 400 = 433.3px (use 433px)
        const pngSize = 433;
        const offsetX = (size - pngSize) / 2 - (1 * 400/216); // Shift left 1px (scaled)
        const offsetY = (size - pngSize) / 2 + (2 * 400/216); // Shift down 2px (scaled proportionally)
        
        // Draw circular text at 436px, centered horizontally and shifted 1px down
        ctx.drawImage(textImage, offsetX, offsetY, pngSize, pngSize);
        ctx.restore();

        // Add inner shadow effect
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        
        // Create radial gradient for shadow
        const shadowGradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          size / 2 - 30,
          size / 2,
          size / 2,
          size / 2
        );
        shadowGradient.addColorStop(0, "rgba(76, 168, 207, 0)");
        shadowGradient.addColorStop(0.7, "rgba(76, 168, 207, 0.1)");
        shadowGradient.addColorStop(1, "rgba(76, 168, 207, 0.3)");
        
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Generate data URL with maximum quality (1.0)
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        onGenerated(dataUrl);
      };

      textImage.onerror = () => {
        console.error("Failed to load circular text image");
        // Still generate without circular text
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        onGenerated(dataUrl);
      };

      textImage.src = circularTextImg;
    };

    img.onerror = () => {
      console.error("Failed to load profile image");
    };

    img.src = profileImage;
  }, [profileImage, onGenerated]);

  return <canvas ref={canvasRef} className="hidden" />;
}
