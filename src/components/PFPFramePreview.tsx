import { useState, useRef } from "react";
import svgPaths from "../imports/svg-qobsxijuss";
import UserDefault from "../imports/User-70-460";
import circularTextImg from "figma:asset/487bc72f6682897b9a66fcf09a3d8e934790eecb.png";
import { Upload } from "lucide-react";

interface PFPFramePreviewProps {
  profileImage: string | null;
  onImageChange: (image: string | null) => void;
}

export function PFPFramePreview({
  profileImage,
  onImageChange,
}: PFPFramePreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-[#4ca8cf] w-full aspect-square max-w-[455.968px] overflow-clip relative">
      {/* Background decorative vector */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[89%] h-[81%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 408 371"
        >
          <path
            d={svgPaths.p27517500}
            fill="var(--fill-0, #C7EAFD)"
            id="Vector 1"
          />
        </svg>
      </div>
      
      {/* Faint background circles */}
      <div className="absolute left-[12.6%] w-[74.5%] aspect-square top-[12.7%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 340 340">
          <circle cx="170" cy="170" fill="var(--fill-0, #4CA8CF)" fillOpacity="0.08" id="Ellipse 1" r="170" />
        </svg>
      </div>
      <div className="absolute left-[1.6%] w-[96.5%] aspect-square top-[1.75%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 440 440">
          <circle cx="220" cy="220" fill="var(--fill-0, #4CA8CF)" fillOpacity="0.08" id="Ellipse 2" r="220" />
        </svg>
      </div>

      <div className="absolute flex flex-col gap-[20px] items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[47.4%]">
        {/* Profile Picture with Frame */}
        <div
          className="bg-[#c7eafd] overflow-clip relative rounded-full aspect-square w-full cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          {!profileImage ? (
            <div className="absolute inset-0">
              <UserDefault />
            </div>
          ) : (
            <div className="absolute left-1/2 w-full aspect-square top-1/2 -translate-x-1/2 -translate-y-1/2">
              <img
                alt="Profile"
                className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full"
                src={profileImage}
              />
            </div>
          )}

          {/* Hover overlay */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity z-20 rounded-full">
              <div className="flex flex-col items-center gap-2 text-white">
                <Upload className="w-6 h-6 md:w-8 md:h-8" />
                <p className="font-['Clash_Grotesk:Regular',_sans-serif] text-[12px] md:text-[14px]">
                  {profileImage ? "Change Image" : "Upload Image"}
                </p>
              </div>
            </div>
          )}

          {/* Circular Text - PNG Image filling entire circle */}
          <div className="absolute pointer-events-none" style={{
            left: 'calc(50% - 0.46%)',
            top: 'calc(50% + 0.93%)',
            width: '108.33%',
            height: '108.33%',
            transform: 'translate(-50%, -50%)',
            clipPath: 'circle(50% at calc(50% + 0.46%) calc(50% - 0.93%))'
          }}>
            <img
              src={circularTextImg}
              alt="Attending Solana Summit Africa"
              style={{ 
                width: '100%', 
                height: '100%',
                display: 'block'
              }}
            />
          </div>

          {/* Inner Shadow */}
          <div className="absolute inset-0 pointer-events-none shadow-[0px_2.16px_22.464px_4.32px_inset_#4ca8cf]" />

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
