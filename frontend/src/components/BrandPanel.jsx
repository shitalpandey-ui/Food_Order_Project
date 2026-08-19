export default function BrandPanel() {
  return (
    <div
      className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-10 lg:p-12 text-cream"
      style={{
        background:
          "radial-gradient(circle at 30% 15%, rgba(232,169,59,0.16), transparent 55%), radial-gradient(circle at 80% 90%, rgba(193,68,46,0.18), transparent 50%), #1C1815",
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-40 font-display font-bold text-5xl tracking-tight text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-turmeric" />
          QuickBites
        </div>

        <QuickBitesIllustration />

        <h1 className="font-display font-semibold text-3xl lg:text-4xl leading-tight tracking-tight text-white">
          Every tier,
          <br />
          <em className="text-turmeric not-italic">packed fresh</em>, on the
          way.
        </h1>

        <p className="text-[0.92rem] leading-relaxed text-[#C9C0B3]">
          One account gets you into every stall, kitchen, and cart on Tiffin — order in,
          track live, and never lose a favourite.
        </p>

        <ul className="flex flex-col gap-3.5 pt-2">
          <Fact chip="01" color="bg-turmeric">
            Local kitchens, plated within the hour
          </Fact>
          <Fact chip="02" color="bg-chili">
            Live rider tracking, door to door
          </Fact>
          <Fact chip="03" color="bg-coriander">
            Saved addresses &amp; repeat orders in one tap
          </Fact>
        </ul>
      </div>

      <div className="font-mono text-[0.65rem] tracking-widest text-[#8A8175] pt-8">
         &nbsp; &nbsp; &nbsp;&nbsp; ORDER LOCAL, EAT FIRST
      </div>
    </div>
  );
}

function Fact({ chip, color, children }) {
  return (
    <li className="flex items-center gap-3 text-xs text-[#D8D1C4]">
      <span
        className={`w-[20px] h-[20px] rounded-[6px] flex-none flex items-center justify-center font-mono text-[0.6rem] font-medium text-charcoal ${color}`}
      >
        {chip}
      </span>
      {children}
    </li>
  );
}

function QuickBitesIllustration() {
  return (
    <svg
      className="my-2"
      width="100"
      height="110"
      viewBox="0 0 120 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="20" y="86" width="80" height="30" rx="8" fill="#7A9471" />
      <rect x="20" y="86" width="80" height="30" rx="8" fill="url(#g1)" fillOpacity="0.25" />
      <rect x="22" y="52" width="76" height="32" rx="8" fill="#C1442E" />
      <rect x="22" y="52" width="76" height="32" rx="8" fill="url(#g1)" fillOpacity="0.2" />
      <rect x="24" y="18" width="72" height="32" rx="8" fill="#E8A93B" />
      <rect x="24" y="18" width="72" height="32" rx="8" fill="url(#g1)" fillOpacity="0.15" />
      <path d="M50 18 C50 8, 70 8, 70 18" stroke="#F5EFE6" strokeWidth="4" strokeLinecap="round" />
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}