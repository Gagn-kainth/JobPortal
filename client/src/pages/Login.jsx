import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AuthSidePanel from "../components/AuthSidePanel";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FCFAF7] animate-[fadeIn_0.4s_ease-out]">
      <AuthSidePanel />

      <div className="w-full lg:w-[55%] flex items-center justify-center p-8">
        <div className="w-112.5 rounded-[22px] p-12 bg-white/85 backdrop-blur-md border border-gray-100 shadow-xl">
          <h2 className="text-[36px] font-bold text-[#1E1E1E]"> Welcome </h2>
          <p className="text-[17px] text-[#6B7280] mt-2 mb-8">
            Sign in to continue your TalentPath journey.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[15px] font-semibold text-[#1E1E1E] mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full h-14 pl-12 pr-4 rounded-xl border border-[#d8d8d8] text-base bg-white
                             focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10
                             transition-shadow duration-150"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter username or email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[15px] font-semibold text-[#1E1E1E]">Password</label>
                <Link to="/forgot-password" className="text-sm text-[#FF6B00] font-medium hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-14 pl-12 pr-12 rounded-xl border border-[#d8d8d8] text-base bg-white
                             focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10
                             transition-shadow duration-150"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-14 rounded-xl bg-[#FF6B00] hover:bg-[#E85D00] text-white font-bold text-base
                         shadow-md transform transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-[15px] mt-6 text-[#1E1E1E]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#FF6B00] font-semibold hover:underline">
              Create Account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;