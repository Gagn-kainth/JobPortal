import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import AuthSidePanel from "../components/AuthSidePanel";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#FCFAF7] overflow-hidden">
      <AuthSidePanel />

      <div className="w-full lg:w-[55%] h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-100 rounded-2xl p-6 bg-white border border-[#ECECEC] shadow-xl">
          {sent ? (
            <>
              <h2 className="text-2xl font-bold text-[#1F2937]">
                Check your email
              </h2>
              <p className="text-sm text-[#6B7280] mt-2">
                If an account exists for <strong>{email}</strong>, we've sent a
                password reset link. It expires in 15 minutes.
              </p>
              <Link
                to="/"
                className="block text-center mt-6 text-[#FF6B00] font-semibold text-sm hover:underline"
              >
                Back to Sign In
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#1F2937]">
                Forgot password?
              </h2>
              <p className="text-sm text-[#6B7280] mt-1 mb-5">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#D8D8D8] text-sm bg-white
                               focus:outline-none focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10
                               transition-shadow duration-150"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#FF6B00] hover:bg-[#E85D00] text-white font-bold text-sm
                             shadow-md transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <Link
                to="/"
                className="block text-center mt-4 text-sm text-[#6B7280] hover:text-[#1F2937]"
              >
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
