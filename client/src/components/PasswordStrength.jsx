import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const rules = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /[0-9]/.test(pw) },
  { label: "One special character", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export const getPasswordStrength = (password) => {
  const passed = rules.filter((r) => r.test(password)).length;
  if (password.length === 0) return { label: "", score: 0, color: "" };
  if (passed <= 1) return { label: "Weak", score: 1, color: "#EF4444" };
  if (passed <= 3) return { label: "Fair", score: 2, color: "#F59E0B" };
  if (passed <= 4) return { label: "Good", score: 3, color: "#EAB308" };
  return { label: "Strong", score: 4, color: "#22C55E" };
};

const PasswordStrength = ({ password, active }) => {
  const strength = getPasswordStrength(password);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="mt-2">
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: strength.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(strength.score / 4) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            {password.length > 0 && (
              <p className="text-xs mt-1 font-semibold" style={{ color: strength.color }}>
                {strength.label} password
              </p>
            )}

            <ul className="mt-1.5 space-y-1">
              {rules.map((rule, i) => {
                const passed = rule.test(password);
                return (
                  <li key={i} className={`text-xs flex items-center gap-2 ${passed ? "text-green-600" : "text-gray-400"}`}>
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-150 ${
                        passed ? "bg-green-500" : "border border-gray-300"
                      }`}
                    >
                      {passed && <Check size={9} className="text-white" />}
                    </span>
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordStrength;