import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowUpRight, Sparkles, CheckCircle2 } from "lucide-react";

const quotes = [
  {
    text: "Choose a job you love, and you will never have to work a day in your life.",
    author: "Confucius",
  },
];

const AuthSidePanel = () => {
  const [quote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  );

  return (
    <div
      className="hidden lg:flex flex-col justify-between
                 w-[45%] h-screen
                 bg-linear-to-br from-[#11131F] via-[#191B2A] to-[#20253A]
                 text-white p-12 xl:p-14
                 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-125 h-125 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-125 h-125 bg-orange-500/5 rounded-full blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating Glow */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 w-40 h-40
                   bg-orange-500/10 rounded-full blur-3xl"
      />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl
                       bg-orange-500
                       flex items-center justify-center
                       shadow-lg shadow-orange-500/20"
          >
            <Briefcase size={21} className="text-white" />
          </div>

          <div>
            <h1 className="font-bold text-2xl tracking-tight">
              Talent<span className="text-orange-500">Path</span>
            </h1>

            <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
              Your career starts here
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg">
        <h2
          className="text-4xl xl:text-5xl
                     font-bold leading-[1.1]
                     tracking-tight"
        >
          Build your career.
          <span className="block text-orange-500">Find your path.</span>
        </h2>

        {/* Quote Card */}
        <div
          className="mt-8 p-5 rounded-2xl
                     bg-white/4
                     border border-white/8
                     backdrop-blur-sm"
        >
          <div className="flex gap-4">
            <div className="w-1 rounded-full bg-orange-500 shrink-0" />

            <div>
              <p className="text-lg xl:text-xl text-gray-200 leading-relaxed">
                "{quote.text}"
              </p>

              <p className="mt-4 text-sm text-gray-500">— {quote.author}</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-5 mt-7">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle2 size={16} className="text-orange-500" />
            Discover opportunities
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-400">
            <CheckCircle2 size={16} className="text-orange-500" />
            Track applications
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative z-10 flex items-center justify-between">
        <p className="text-xs text-gray-600">© 2026 TalentPath</p>

        <motion.div
          whileHover={{ x: 4, y: -4 }}
          className="w-9 h-9 rounded-full
                     border border-white/10
                     flex items-center justify-center
                     text-gray-500
                     hover:text-orange-500
                     hover:border-orange-500/30
                     transition-colors"
        >
          <ArrowUpRight size={16} />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthSidePanel;
