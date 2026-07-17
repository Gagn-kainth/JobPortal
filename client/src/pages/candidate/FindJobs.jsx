import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  MapPin,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Briefcase,
  Upload,
  X,
  Bookmark,
} from "lucide-react";
import Button from "../../components/Button";

const FindJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [hasResume, setHasResume] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs?keyword=${keyword}`);
      setJobs(res.data.jobs);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const checkProfile = async () => {
    try {
      const res = await api.get("/auth/profile");
      setHasResume(!!res.data.user.resumeUrl);
      setSavedJobs(new Set(res.data.user.savedJobs || []));
    } catch {
      // silent fail
    }
  };

  useEffect(() => {
    fetchJobs();
    checkProfile();
  }, []);

  const toggleExpand = (jobId) => {
    setExpandedJobs((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const toggleSaveJob = async (jobId) => {
    try {
      if (savedJobs.has(jobId)) {
        await api.delete(`/jobs/${jobId}/save`);
        setSavedJobs((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
        toast.success("Removed from saved jobs");
      } else {
        await api.post(`/jobs/${jobId}/save`);
        setSavedJobs((prev) => new Set(prev).add(jobId));
        toast.success("Job saved");
      }
    } catch {
      toast.error("Failed to update saved jobs");
    }
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

  const formatSalary = (salary) => {
    const num = Number(salary);
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
    return `₹${num}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Find Jobs</h1>
      <p className="text-sm text-gray-500 mt-1">
        {jobs.length} {jobs.length === 1 ? "job" : "jobs"} available
      </p>

      <div className="relative mt-4">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm bg-white
                     focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10
                     transition-shadow duration-150"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
          placeholder="Search roles, companies, keywords..."
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="flex gap-4 mt-3">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-20 bg-gray-200 rounded mt-3" />
              <div className="h-8 bg-gray-200 rounded mt-4" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Briefcase size={48} className="text-gray-200 mb-4" />
          <p className="font-medium text-gray-600">No jobs found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your search keywords
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 items-start">
          {jobs.map((job) => {
            const isExpanded = expandedJobs[job._id];
            const visibleRequirements = isExpanded
              ? job.requirements
              : job.requirements?.slice(0, 3);
            const hiddenCount = (job.requirements?.length || 0) - 3;
            const isSaved = savedJobs.has(job._id);

            return (
              <div
                key={job._id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 
                           transition-all duration-200 hover:shadow-md hover:border-orange-200
                           flex flex-col h-full min-w-0"
              >
                {/* Header with save button */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-lg text-gray-900 capitalize min-w-0">
                    <span className="block truncate">{job.title}</span>
                  </h3>
                  <button
                    onClick={() => toggleSaveJob(job._id)}
                    className={`p-2 rounded-lg transition-colors shrink-0 ${
                      isSaved
                        ? "bg-orange-50 text-orange-500"
                        : "bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                    }`}
                    title={isSaved ? "Remove from saved" : "Save job"}
                  >
                    <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-gray-500 mt-2.5">
                  <span className="flex items-center gap-1 min-w-0">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <DollarSign size={14} className="shrink-0" />
                    {formatSalary(job.salary)}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock size={14} className="shrink-0" />
                    {job.jobType}
                  </span>
                </div>

                <p
                  className={`text-sm text-gray-600 mt-3 leading-relaxed ${
                    !isExpanded ? "line-clamp-3" : ""
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
                          className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 rounded-lg border border-gray-100 wrap-break-word max-w-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>

                    {job.requirements.length > 3 && (
                      <button
                        onClick={() => toggleExpand(job._id)}
                        className="flex items-center gap-1 text-xs text-orange-500 font-medium mt-2.5 hover:text-orange-600 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            Show less <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            +{hiddenCount} more requirement
                            {hiddenCount > 1 ? "s" : ""}{" "}
                            <ChevronDown size={14} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Spacer pushes buttons to bottom */}
                <div className="flex-1" />

                {applyingJobId === job._id ? (
                  <div className="mt-4 p-3 bg-orange-50/50 rounded-xl border border-orange-100 min-w-0">
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5 min-w-0">
                        <Upload size={13} className="text-orange-500 shrink-0" />
                        <span className="truncate">Upload resume to apply</span>
                      </p>
                      <button
                        onClick={() => {
                          setApplyingJobId(null);
                          setResumeFile(null);
                        }}
                        className="p-1 rounded-md hover:bg-orange-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <label className="block">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="hidden"
                      />
                      <div
                        className={`h-10 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed cursor-pointer text-sm transition-colors px-3 ${
                          resumeFile
                            ? "border-orange-300 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-orange-300 text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {resumeFile ? (
                          <>
                            <Upload size={14} className="shrink-0" />
                            <span className="truncate">{resumeFile.name}</span>
                          </>
                        ) : (
                          <>
                            <Upload size={14} className="shrink-0" />
                            <span className="truncate">Click to upload PDF, DOC, or DOCX</span>
                          </>
                        )}
                      </div>
                    </label>
                    <div className="flex gap-2 mt-2.5">
                      <Button onClick={submitWithNewResume} className="flex-1 h-9">
                        Submit Application
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleApplyClick(job._id)}
                    className="w-full mt-4 h-10"
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FindJobs;