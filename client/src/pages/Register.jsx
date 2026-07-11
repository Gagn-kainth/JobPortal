import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AuthSidePanel from "../components/AuthSidePanel";
import PasswordStrength, { getPasswordStrength } from "../components/PasswordStrength";
import Button from "../components/Button";

const Register = () => {
  const [form, setForm] = useState({
    name: "", email: "", username: "", password: "", role: "candidate",
  });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const strength = getPasswordStrength(form.password);
    if (strength.score < 2) {
      return toast.error("Please choose a stronger password");
    }

    try {
      await register(form);
      toast.success("Registered! Please login.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f5f0e8]">
      <AuthSidePanel />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-1">Create your account</h2>
          <p className="text-gray-500 text-sm mb-6">Find your next opportunity with TalentPath</p>

          {["name", "email", "username"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
              <input
                name={field}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                value={form[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              required
            />
            <PasswordStrength password={form.password} active={passwordFocused} />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">I am a</label>
            <select
              name="role"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
              value={form.role}
              onChange={handleChange}
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <Button type="submit" className="w-full">Create Account</Button>

          <p className="text-center text-sm mt-4">
            Already have an account? <Link to="/" className="text-orange-500 font-medium">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;