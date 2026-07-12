import { useState } from "react";
import { Briefcase } from "lucide-react";

const quotes = [
  { text: "Choose a job you love, and you will never have to work a day in your life.", author: "Confucius" },
];

const AuthSidePanel = () => {
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[#191B2A] text-white p-14 relative overflow-hidden">
      <div className="flex items-center gap-2 font-bold text-2xl z-10">
        <Briefcase className="text-[#FF6B00]" size={26} /> TalentPath
      </div>

      <div className="z-10 max-w-md">
        <p className="text-4xl font-bold leading-tight">"{quote.text}"</p>
        <p className="mt-5 text-gray-400 text-lg">— {quote.author}</p>
      </div>

      <p className="text-base text-gray-500 z-10">
        Join over 12,000+ companies hiring on TalentPath.
      </p>

      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-16 -left-16 w-72 h-72 bg-[#FF6B00]/5 rounded-full blur-3xl" />
    </div>
  );
};

export default AuthSidePanel;