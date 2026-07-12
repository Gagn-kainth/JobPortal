import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const quotes = [
  { text: "Choose a job you love, and you will never have to work a day in your life.", author: "Confucius" },
];

const AuthSidePanel = () => {
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div className="hidden lg:flex flex-col justify-between w-[45%] h-screen bg-linear-to-br from-[#191B2A] to-[#20253A] text-white p-14 relative overflow-hidden">
      <div className="flex items-center gap-2 font-bold text-2xl z-10">
        <Briefcase className="text-[#FF6B00]" size={26} /> TalentPath
      </div>

      <div className="z-10 max-w-md">
        <p className="text-4xl font-bold leading-tight">"{quote.text}"</p>
        <p className="mt-5 text-gray-400 text-lg">— {quote.author}</p>
      </div>

      <div />

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 -left-16 w-72 h-72 bg-[#FF6B00]/5 rounded-full blur-3xl"
      />
    </div>
  );
};

export default AuthSidePanel;