import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "", email: "", username: "", password: "", role: "candidate",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success("Registered! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl w-95 shadow-md">
        <h2 className="text-xl font-bold mb-6">Create Account</h2>

        {["name", "email", "username"].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
            <input
              name={field}
              className="w-full border rounded-lg px-3 py-2 text-sm"
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
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">I am a</label>
          <select
            name="role"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.role}
            onChange={handleChange}
          >
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>

        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium">
          Register
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-orange-500">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;