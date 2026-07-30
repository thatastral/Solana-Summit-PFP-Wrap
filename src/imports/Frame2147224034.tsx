import svgPaths from "./svg-zk8dnaahqy";

function Group() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 194 194">
      <g id="Group">
        <g id="Vector"></g>
        <path d={svgPaths.pa0eed00} fill="url(#paint0_linear_62_143)" id="Vector_2" />
      </g>
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_62_143" x1="91.5608" x2="91.5608" y1="16.3178" y2="304.598">
          <stop stopColor="#4CA8CF" />
          <stop offset="1" stopColor="#275569" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function User2Fill() {
  return (
    <div className="absolute left-1/2 overflow-clip size-[194px] top-[calc(50%+16px)] translate-x-[-50%] translate-y-[-50%]" data-name="user_2_fill">
      <Group />
    </div>
  );
}

function Frame1() {
  return <div className="absolute h-[218.468px] left-[-8.64px] top-[8.1px] w-[229.827px]" />;
}

function User() {
  return (
    <div className="bg-[#c7eafd] overflow-clip relative rounded-[5400px] shrink-0 size-[216px]" data-name="User">
      <User2Fill />
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*0.43723800778388977)+(var(--transform-inner-height)*0.8993458151817322)))] items-center justify-center left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[calc(1px*((var(--transform-inner-height)*0.43723800778388977)+(var(--transform-inner-width)*0.8993458151817322)))]" style={{ "--transform-inner-width": "216", "--transform-inner-height": "216" } as React.CSSProperties}>
        <div className="flex-none rotate-[334.072deg]">
          <div className="relative size-[216px]" data-name="Ellipse">
            <div className="absolute bottom-0 left-0 right-[4.04%] top-0">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 208 216">
                <foreignObject height="0" width="0" x="0" y="0">
                  <div style={{ backdropFilter: "blur(1.08px)", clipPath: "url(#bgblur_0_62_96_clip_path)", height: "100%", width: "100%" }} xmlns="http://www.w3.org/1999/xhtml" />
                </foreignObject>
                <path d={svgPaths.p1ff55300} data-figma-bg-blur-radius="2.16" fill="url(#paint0_linear_62_96)" id="Ellipse" />
                <defs>
                  <clipPath id="bgblur_0_62_96_clip_path" transform="translate(0 0)">
                    <path d={svgPaths.p1ff55300} />
                  </clipPath>
                  <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_62_96" x1="86.8276" x2="-84.508" y1="17.5483" y2="138.398">
                    <stop stopColor="#4CA8CF" stopOpacity="0" />
                    <stop offset="0.319839" stopColor="#4CA8CF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame1 />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_2.16px_22.464px_4.32px_inset_#4ca8cf]" />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative size-full">
      <User />
    </div>
  );
}