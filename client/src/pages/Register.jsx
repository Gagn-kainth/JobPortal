import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AuthSidePanel from "../components/AuthSidePanel";
import PasswordStrength, {
  getPasswordStrength,
} from "../components/PasswordStrength";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const Register = () => {
  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: "candidate" } });

  const { register } = useAuth();
  const navigate = useNavigate();

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordValue = watch("password", "");

  const onSubmit = async (data) => {
    const strength = getPasswordStrength(data.password);
    if (strength.score < 2) {
      return toast.error("Please choose a stronger password");
    }

    setLoading(true);
    try {
      await register(data);
      toast.success("Registered! Please login.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordBlur = () => {
    if (passwordValue.length === 0) setPasswordFocused(false);
  };

  const inputClass =
    "w-full h-11 px-3.5 rounded-xl border border-[#D8D8D8] text-sm bg-white " +
    "focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 " +
    "transition-shadow duration-150";

  return (
    <div className="h-screen flex bg-[#FCFAF7] overflow-hidden">
      <AuthSidePanel />

      <div className="w-full lg:w-[55%] h-screen flex items-start justify-center overflow-y-auto p-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-105 my-auto"
        >
          <h2 className="text-2xl font-bold text-[#1F2937] leading-tight">
            Create your account
          </h2>
          <p className="text-sm text-[#6B7280] mt-0.5 mb-4">
            Find your next opportunity with TalentPath
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2.5"
            noValidate
          >
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-[#1F2937] mb-1"
              >
                Name
              </label>
              <input
                id="name"
                className={inputClass}
                aria-invalid={!!errors.name}
                {...formRegister("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-[#EF4444] mt-0.5">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#1F2937] mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className={inputClass}
                aria-invalid={!!errors.email}
                {...formRegister("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-[#EF4444] mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold text-[#1F2937] mb-1"
              >
                Username
              </label>
              <input
                id="username"
                className={inputClass}
                aria-invalid={!!errors.username}
                {...formRegister("username", {
                  required: "Username is required",
                })}
              />
              {errors.username && (
                <p className="text-xs text-[#EF4444] mt-0.5">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#1F2937] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={inputClass + " pr-10"}
                  aria-invalid={!!errors.password}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={handlePasswordBlur}
                  {...formRegister("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength
                password={passwordValue}
                active={passwordFocused}
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-xs font-semibold text-[#1F2937] mb-1"
              >
                Role
              </label>
              <select
                id="role"
                className="w-full h-11 px-3.5 rounded-2xl border border-[#D8D8D8] text-sm bg-white
             focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10
             transition-shadow duration-150 appearance-none"
                {...formRegister("role")}
              >
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            <label className="flex items-start gap-2 pt-0.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 accent-[#FF6B00]"
              />
              <span className="text-xs text-[#6B7280]">
                I agree to the Terms of Service and Privacy Policy.
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreed || loading}
              className="w-full h-11 rounded-xl bg-[#FF6B00] hover:bg-[#E85D00] text-white font-bold text-sm
                         shadow-md transform transition-all duration-150 hover:-translate-y-0.5
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                         flex items-center justify-center gap-2 mt-1"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs mt-3 text-[#1F2937]">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-[#FF6B00] font-semibold hover:underline"
            >
              Sign In →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
