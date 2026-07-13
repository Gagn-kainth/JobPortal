import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import AuthSidePanel from "../components/AuthSidePanel";
import PasswordStrength, { getPasswordStrength } from "../components/PasswordStrength";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const strength = getPasswordStrength(password);
    if (strength.score < 2) {
      return toast.error("Please choose a stronger password");
    }

    setLoading(true);
    try {
      await api.put(`/auth/reset-password/${token}`, { newPassword: password });
      toast.success("Password reset! Please login.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Reset link is invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#FCFAF7] overflow-hidden">
      <AuthSidePanel />

      <div className="w-full lg:w-[55%] h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-100 rounded-2xl p-6 bg-white border border-[#ECECEC] shadow-xl">
          <h2 className="text-2xl font-bold text-[#1F2937]">Set a new password</h2>
          <p className="text-sm text-[#6B7280] mt-1 mb-5">
            Choose a strong password for your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#1F2937] mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => password.length === 0 && setFocused(false)}
                  className="w-full h-11 px-3.5 pr-10 rounded-xl border border-[#D8D8D8] text-sm bg-white
                             focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10
                             transition-shadow duration-150"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={password} active={focused} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#FF6B00] hover:bg-[#E85D00] text-white font-bold text-sm
                         shadow-md transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <Link to="/" className="block text-center mt-4 text-sm text-[#6B7280] hover:text-[#1F2937]">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;