
export default function BrandPanel() {
  return (
    <div
      className="relative hidden lg:flex lg:w-1/2 flex-col justify-between gap-10px px-10 py-12 text-cream"
      style={{
        background:
          "radial-gradient(circle at 40% 15%, rgba(232,169,59,0.16), transparent 45%), radial-gradient(circle at 80% 90%, rgba(193,68,46,0.18), transparent 50%), #1C1815",
      }}
    >
      <div className="flex flex-col gap-7">
        <div className="flex items-center gap-40px font-display font-bold text-6xl tracking-tight text-white">
          <span className="w-2.5 h-2.5 py-40 rounded-full bg-turmeric" />
          QuickBites
        </div>

        <QuickBitesIllustration />

        <h1 className=" font-display font-semibold text-3xl lg:text-5xl leading-tight tracking-tight text-white" >
          Every bites,
          <br />
          <span className="text-turmeric not-italic">packed fresh</span>, on the
          way.
        </h1>

        <p className="text-[1.5rem] leading-relaxed text-[#C9C0B3]">
          One account gets you into every stall,<br></br> kitchen, and cart on QuickBites — order in,<br></br>
          track live, and never lose a favourite.
        </p>

        <ul className="flex flex-col gap-6 pt-4">
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

     <div className="font-mono text-xl tracking-widest text-#8A8175 pt-10">
      &nbsp; &nbsp; &nbsp; ORDER LOCAL, EAT FIRST
      </div>
    </div>
  );
}

function Fact({ chip, color, children }) {
  return (
    <li className="flex items-center gap-6 text-2xl text-#D8D1C4">
      <span
        className={`w-[30px] h-[30px] rounded-[6px] flex-none flex items-center justify-center font-mono text-[1.5rem] font-1xl text-charcoal ${color}`}
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
      className="my-6"
      align-items ="center"
      width="130"
      height="140"
      viewBox="0 0 120 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bottom - green */}
   <rect x="30" y="88" width="90" height="44" rx="12" fill="#7A9471" />
  <rect x="30" y="88" width="90" height="44" rx="10" fill="url(#g1)" fillOpacity="0.25" />

  {/* Middle - red */}
   <rect x="32" y="38" width="86" height="44" rx="12" fill="#C1442E" />
   <rect x="32" y="38" width="86" height="44" rx="12" fill="url(#g1)" fillOpacity="0.25" />

  {/* Top - orange */}
   <rect x="34" y="0" width="72" height="32" rx="8" fill="#E8A93B" />
   <rect x="34" y="0" width="72" height="32" rx="8" fill="url(#g1)" fillOpacity="0.15" />  
      <path
        d="M50 18 C50 8, 70 8, 70 18"
        stroke="#F5EFE6"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}