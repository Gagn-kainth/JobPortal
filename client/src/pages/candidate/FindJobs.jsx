import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { MapPin, DollarSign, Clock, Bookmark } from "lucide-react";

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");

  const fetchJobs = async () => {
    const res = await api.get(`/jobs?keyword=${keyword}`);
    setJobs(res.data.jobs);
  };

  useEffect(() => { fetchJobs(); }, []);

  const applyToJob = async (jobId) => {
    try {
      const formData = new FormData();
      formData.append("coverLetter", "Interested in this role");
      await api.post(`/applications/${jobId}`, formData);
      toast.success("Applied successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Find Jobs</h1>
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
        placeholder="Search roles, companies, keywords..."
        className="w-full mt-4 p-3 rounded-lg border"
      />
      <div className="grid grid-cols-2 gap-4 mt-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <div className="flex gap-4 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
              <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {job.jobType}</span>
            </div>
            <button onClick={() => applyToJob(job._id)} className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindJobs;