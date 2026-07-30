import svgPaths from "./svg-guffbc606v";

function Group() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 232 232">
      <g id="Group">
        <g id="Vector"></g>
        <path d={svgPaths.p122d4780} fill="url(#paint0_linear_70_464)" id="Vector_2" />
      </g>
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_70_464" x1="109.495" x2="109.495" y1="19.5141" y2="364.262">
          <stop stopColor="#4CA8CF" />
          <stop offset="1" stopColor="#275569" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function User2Fill() {
  return (
    <div className="absolute left-1/2 overflow-clip w-[100px] h-[100px] md:size-[232px] top-[calc(50%+9px)] md:top-[calc(50%+20px)] translate-x-[-50%] translate-y-[-50%] p-[0px] m-[0px]" data-name="user_2_fill">
      <Group />
    </div>
  );
}

export default function User() {
  return (
    <div className="bg-[#c7eafd] overflow-clip relative rounded-[5400px] size-full p-[0px] m-[0px]" data-name="User">
      <User2Fill />
      <div className="absolute inset-0 pointer-events-none shadow-[0px_2.16px_22.464px_4.32px_inset_#4ca8cf]" />
    </div>
  );
}