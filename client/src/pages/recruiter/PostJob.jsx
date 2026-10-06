import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const PostJob = () => {
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
    jobType: "Full-time",
    experienceLevel: "Fresher",
    requirements: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/jobs", {
        ...form,
        salary: Number(form.salary),
        requirements: form.requirements.split("\n").filter(Boolean),
      });

      toast.success("Job posted");
      navigate("/my-jobs");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post job");
    }
  };

  const inputClass = `
    w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm
    bg-white text-gray-800
    hover:border-orange-300 hover:bg-orange-50/30
    focus:outline-none focus:border-orange-400
    focus:ring-4 focus:ring-orange-400/10
    transition-all duration-200
  `;

  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Post a Job</h1>

      <p className="text-sm text-gray-500 mt-1">
        Create a new job opportunity for candidates.
      </p>

      <form
        onSubmit={handleSubmit}
        className="
          bg-white rounded-2xl p-6 mt-6
          shadow-sm border border-gray-100
          space-y-5 max-w-2xl
          hover:border-orange-100 hover:shadow-md
          transition-all duration-200
        "
      >
        {/* Job Title */}
        <div>
          <label className={labelClass}>Job Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Full Stack Developer"
            className={inputClass}
            required
          />
        </div>

        {/* Company */}
        <div>
          <label className={labelClass}>Company</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Enter company name"
            className={inputClass}
            required
          />
        </div>

        {/* Location + Salary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Mohali"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Salary (USD/yr)</label>
            <input
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              placeholder="e.g. 50000"
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Employment + Experience */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Employment Type</label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Experience Level</label>
            <select
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option>Fresher</option>
              <option>Junior</option>
              <option>Intermediate</option>
              <option>Senior</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Job Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the role, responsibilities and what the candidate will work on..."
            className={`${inputClass} resize-none`}
            required
          />
        </div>

        {/* Requirements */}
        <div>
          <label className={labelClass}>
            Requirements
            <span className="text-gray-400 font-normal ml-1">
              (one per line)
            </span>
          </label>

          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={4}
            placeholder={"React.js\nNode.js\nMongoDB\nREST APIs"}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Submit */}
        <div className="pt-1">
          <Button
            type="submit"
            className="
              hover:scale-[1.02]
              transition-all duration-200
            "
          >
            Post Job
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
