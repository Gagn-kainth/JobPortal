const rules = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw) => /[0-9]/.test(pw) },
  { label: "One special character (!@#$...)", test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export const getPasswordStrength = (password) => {
  const passed = rules.filter((r) => r.test(password)).length;
  if (password.length === 0) return { label: "", score: 0, color: "" };
  if (passed <= 2) return { label: "Weak", score: 1, color: "bg-red-500" };
  if (passed <= 4) return { label: "Medium", score: 2, color: "bg-yellow-500" };
  return { label: "Strong", score: 3, color: "bg-green-500" };
};

const PasswordStrength = ({ password, active }) => {

  if (!active) return null;

  const strength = getPasswordStrength(password);

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${
              i <= strength.score ? strength.color : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {password.length > 0 && (
        <p className={`text-xs mt-1 font-medium ${
          strength.score === 1 ? "text-red-500" : strength.score === 2 ? "text-yellow-600" : "text-green-600"
        }`}>
          {strength.label} password
        </p>
      )}
      <ul className="mt-2 space-y-1">
        {rules.map((rule, i) => {
          const passed = rule.test(password);
          return (
            <li key={i} className={`text-xs flex items-center gap-1.5 ${passed ? "text-green-600" : "text-gray-400"}`}>
              <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${passed ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                {passed ? "✓" : ""}
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordStrength;