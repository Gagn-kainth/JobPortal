import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  MapPin,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Button from "../../components/Button";

const FindJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [hasResume, setHasResume] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [expandedJobs, setExpandedJobs] = useState({});

  const fetchJobs = async () => {
    const res = await api.get(`/jobs?keyword=${keyword}`);
    setJobs(res.data.jobs);
  };

  const checkProfile = async () => {
    const res = await api.get("/auth/profile");
    setHasResume(!!res.data.user.resumeUrl);
  };

  useEffect(() => {
    fetchJobs();
    checkProfile();
  }, []);

  const toggleExpand = (jobId) => {
    setExpandedJobs((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const applyDirectly = async (jobId) => {
    try {
      const formData = new FormData();
      formData.append("coverLetter", "Interested in this role");
      await api.post(`/applications/${jobId}`, formData);
      toast.success("Applied using your saved resume!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply");
    }
  };

  const submitWithNewResume = async () => {
    if (!resumeFile) return toast.error("Please select a resume file");
    try {
      const formData = new FormData();
      formData.append("coverLetter", "Interested in this role");
      formData.append("resume", resumeFile);
      await api.post(`/applications/${applyingJobId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Applied successfully!");
      setApplyingJobId(null);
      setResumeFile(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply");
    }
  };

  const handleApplyClick = (jobId) => {
    if (hasResume) {
      applyDirectly(jobId);
    } else {
      setApplyingJobId(jobId);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Find Jobs</h1>
      <input
        className="w-full mt-4 p-3 rounded-lg border"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
        placeholder="Search roles, companies, keywords..."
      />
      <div className="grid grid-cols-2 gap-4 mt-6">
        {jobs.map((job) => {
          const isExpanded = expandedJobs[job._id];
          const visibleRequirements = isExpanded
            ? job.requirements
            : job.requirements?.slice(0, 3);
          const hiddenCount = (job.requirements?.length || 0) - 3;

          return (
            <div
              key={job._id}
              className="bg-white rounded-xl p-5 shadow-sm border border-transparent transition-all duration-200 hover:shadow-lg hover:border-orange-200 hover:-translate-y-1"
            >
              <h3 className="font-semibold text-lg capitalize">{job.title}</h3>
              <div className="flex gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign size={14} /> {job.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {job.jobType}
                </span>
              </div>

              <p
                className={`text-sm text-gray-600 mt-3 ${
                  !expandedJobs[job._id] ? "line-clamp-4" : ""
                }`}
              >
                {job.description}
              </p>

              {job.requirements?.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {visibleRequirements.map((req, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        {req}
                      </span>
                    ))}
                  </div>

                  {job.requirements.length > 3 && (
                    <button
                      onClick={() => toggleExpand(job._id)}
                      className="flex items-center gap-1 text-xs text-orange-500 font-medium mt-2 hover:text-orange-600"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp size={14} />
                        </>
                      ) : (
                        <>
                          +{hiddenCount} more requirement
                          {hiddenCount > 1 ? "s" : ""} <ChevronDown size={14} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {applyingJobId === job._id ? (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-500">
                    No resume on file. Upload one to apply:
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button onClick={submitWithNewResume} className="flex-1">
                      Submit
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setApplyingJobId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => handleApplyClick(job._id)}
                  className="w-full mt-4"
                >
                  Apply Now
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FindJobs;
