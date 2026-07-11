import { useState } from "react";
import { Briefcase } from "lucide-react";

const quotes = [
  {
    text: "Your career is a marathon, not a sprint. The right opportunity is worth the wait.",
    author: "Indra Nooyi",
  },
  {
    text: "Choose a job you love, and you will never have to work a day in your life.",
    author: "Confucius",
  },
  {
    text: "Opportunities don't happen. You create them.",
    author: "Chris Grosser",
  },
];

const AuthSidePanel = () => {
 
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#1a1d29] text-white p-12 relative overflow-hidden">
      <div className="flex items-center gap-2 font-bold text-xl z-10">
        <Briefcase className="text-orange-500" /> TalentPath
      </div>

      <div className="z-10">
        <p className="text-3xl font-semibold leading-snug">"{quote.text}"</p>
        <p className="mt-4 text-gray-400">— {quote.author}</p>
      </div>

      <p className="text-sm text-gray-500 z-10">
        Join over 12,000+ companies hiring on TalentPath.
      </p>

      <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-500/10 rounded-full" />
      <div className="absolute bottom-10 -left-10 w-56 h-56 bg-orange-500/5 rounded-full" />
    </div>
  );
};

export default AuthSidePanel;