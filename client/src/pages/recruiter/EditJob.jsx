import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Button from "../../components/Button";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => {
      const job = res.data;
      setForm({
        ...job,
        requirements: (job.requirements || []).join("\n"),
      });
    });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/jobs/${id}`, {
        ...form,
        salary: Number(form.salary),
        requirements: form.requirements.split("\n").filter(Boolean),
      });
      toast.success("Job updated");
      navigate("/my-jobs");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update job");
    }
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Job</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 mt-6 shadow-sm space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input name="company" value={form.company} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Salary (USD/yr)</label>
            <input name="salary" type="number" value={form.salary} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employment Type</label>
            <select name="jobType" value={form.jobType} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience Level</label>
            <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm">
              <option>Fresher</option>
              <option>Junior</option>
              <option>Intermediate</option>
              <option>Senior</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Job Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Requirements (one per line)</label>
          <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={4} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default EditJob;