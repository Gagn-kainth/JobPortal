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
  Loader2,
} from "lucide-react";
import Button from "../../components/Button";

const FindJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [hasResume, setHasResume] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [applying, setApplying] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [expandedJobs, setExpandedJobs] = useState({});
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Jobs
  // =========================
  const fetchJobs = async () => {
    setLoading(true);

    try {
      const res = await api.get(`/jobs?keyword=${encodeURIComponent(keyword)}`);

      setJobs(res.data.jobs || []);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Check Profile
  // =========================
  const checkProfile = async () => {
    try {
      const res = await api.get("/auth/profile");

      setHasResume(!!res.data.user.resumeUrl);

      setSavedJobs(new Set(res.data.user.savedJobs || []));
    } catch {
      // Silent fail
    }
  };

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    fetchJobs();
    checkProfile();
  }, []);

  // =========================
  // Expand Requirements
  // =========================
  const toggleExpand = (jobId) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  // =========================
  // Save / Unsave Job
  // =========================
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

        setSavedJobs((prev) => {
          const next = new Set(prev);
          next.add(jobId);
          return next;
        });

        toast.success("Job saved");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update saved jobs");
    }
  };

  // =========================
  // Apply Using Saved Resume
  // =========================
  const applyDirectly = async (jobId) => {
    setApplying(jobId);

    try {
      const formData = new FormData();

      formData.append("coverLetter", "Interested in this role");

      await api.post(`/applications/${jobId}`, formData);

      toast.success("Applied using your saved resume!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  // =========================
  // Submit New Resume
  // =========================
  const submitWithNewResume = async () => {
    if (!resumeFile) {
      return toast.error("Please select a resume file");
    }

    setApplying(applyingJobId);

    try {
      const formData = new FormData();

      formData.append("coverLetter", "Interested in this role");

      formData.append("resume", resumeFile);

      await api.post(`/applications/${applyingJobId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Applied successfully!");

      setApplyingJobId(null);
      setResumeFile(null);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply");
    } finally {
      setApplying(null);
    }
  };

  // =========================
  // Apply Button
  // =========================
  const handleApplyClick = (jobId) => {
    if (hasResume) {
      applyDirectly(jobId);
    } else {
      setApplyingJobId(jobId);
    }
  };

  // =========================
  // Format Salary
  // =========================
  const formatSalary = (salary) => {
    const num = Number(salary);

    if (!num) return "Not specified";

    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }

    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(0)}K`;
    }

    return `₹${num}`;
  };

  // =========================
  // Render
  // =========================
  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Jobs</h1>

        <p className="text-sm text-gray-500 mt-1">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"} found
          {keyword && <span className="text-gray-400"> for "{keyword}"</span>}
        </p>
      </div>

      {/* Search */}
      <div className="relative mt-4">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          className="w-full h-11 pl-10 pr-10 rounded-xl
          border border-gray-200 text-sm bg-white
          focus:outline-none
          focus:border-orange-400
          focus:ring-4 focus:ring-orange-400/10
          transition-all"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchJobs();
            }
          }}
          placeholder="Search roles, companies, keywords..."
        />

        {keyword && (
          <button
            onClick={() => {
              setKeyword("");
              setTimeout(() => {
                fetchJobs();
              }, 0);
            }}
            className="absolute right-3 top-1/2
            -translate-y-1/2
            text-gray-400
            hover:text-gray-600
            transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5
              shadow-sm border border-gray-100
              animate-pulse"
            >
              <div className="flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
              </div>

              <div className="flex gap-4 mt-4">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>

              <div className="h-16 bg-gray-200 rounded mt-4" />

              <div className="flex gap-2 mt-4">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-20" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>

              <div className="h-10 bg-gray-200 rounded-lg mt-5" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
            <Briefcase size={32} className="text-gray-300" />
          </div>

          <p className="font-medium text-gray-600">No jobs found</p>

          <p className="text-sm text-gray-400 mt-1">
            Try adjusting your search keywords
          </p>

          {keyword && (
            <button
              onClick={() => {
                setKeyword("");
                setTimeout(() => {
                  fetchJobs();
                }, 0);
              }}
              className="mt-4 text-sm text-orange-500
              font-medium hover:text-orange-600"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        /* Job Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 items-start">
          {jobs.map((job) => {
            const isExpanded = expandedJobs[job._id];

            const visibleRequirements = isExpanded
              ? job.requirements
              : job.requirements?.slice(0, 3);

            const hiddenCount = (job.requirements?.length || 0) - 3;

            const isSaved = savedJobs.has(job._id);

            const isApplying = applying === job._id;

            return (
              <div
                key={job._id}
                className="bg-white rounded-2xl p-5
                shadow-sm border border-gray-100
                transition-all duration-200
                hover:shadow-md
                hover:border-orange-200
                flex flex-col h-full
                min-w-0"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 capitalize truncate">
                      {job.title}
                    </h3>
                  </div>

                  {/* Save */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveJob(job._id);
                    }}
                    className={`p-2 rounded-lg
                    transition-all shrink-0
                    ${
                      isSaved
                        ? "bg-orange-50 text-orange-500"
                        : "bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                    }`}
                    title={isSaved ? "Remove from saved" : "Save job"}
                  >
                    <Bookmark
                      size={16}
                      fill={isSaved ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                {/* Job Meta */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mt-3">
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

                {/* Description */}
                <p
                  className={`text-sm text-gray-600 mt-4 leading-relaxed ${
                    !isExpanded ? "line-clamp-3" : ""
                  }`}
                >
                  {job.description}
                </p>

                {/* Requirements */}
                {job.requirements?.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {visibleRequirements?.map((req, i) => (
                        <span
                          key={i}
                          className="bg-gray-50
                            text-gray-600
                            text-xs px-2.5 py-1
                            rounded-lg
                            border border-gray-100
                            wrap-break-word
                            max-w-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>

                    {/* Expand */}
                    {job.requirements.length > 3 && (
                      <button
                        onClick={() => toggleExpand(job._id)}
                        className="flex items-center
                        gap-1 text-xs
                        text-orange-500
                        font-medium mt-3
                        hover:text-orange-600
                        transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            Show less
                            <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            +{hiddenCount} more{" "}
                            {hiddenCount > 1 ? "requirements" : "requirement"}
                            <ChevronDown size={14} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Application Area */}
                {applyingJobId === job._id ? (
                  <div
                    className="mt-5 p-3.5
                    bg-orange-50/50
                    rounded-xl
                    border border-orange-100
                    min-w-0"
                  >
                    {/* Upload Header */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <p className="text-xs text-gray-600 font-medium flex items-center gap-1.5 min-w-0">
                        <Upload
                          size={13}
                          className="text-orange-500 shrink-0"
                        />

                        <span className="truncate">Upload resume to apply</span>
                      </p>

                      <button
                        onClick={() => {
                          setApplyingJobId(null);
                          setResumeFile(null);
                        }}
                        className="p-1 rounded-md
                        hover:bg-orange-100
                        text-gray-400
                        hover:text-gray-600
                        transition-colors
                        shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* File Input */}
                    <label className="block">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          setResumeFile(file || null);
                        }}
                        className="hidden"
                      />

                      <div
                        className={`h-11
                        flex items-center
                        justify-center gap-2
                        rounded-lg
                        border-2 border-dashed
                        cursor-pointer
                        text-sm
                        transition-colors
                        px-3
                        ${
                          resumeFile
                            ? "border-orange-300 bg-orange-50 text-orange-700"
                            : "border-gray-200 hover:border-orange-300 text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        <Upload size={14} className="shrink-0" />

                        <span className="truncate">
                          {resumeFile
                            ? resumeFile.name
                            : "Click to upload PDF, DOC, or DOCX"}
                        </span>
                      </div>
                    </label>

                    {/* Submit */}
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={submitWithNewResume}
                        disabled={isApplying}
                        className="flex-1 h-9"
                      >
                        {isApplying ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={14} className="animate-spin" />
                            Applying...
                          </span>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Apply */
                  <Button
                    onClick={() => handleApplyClick(job._id)}
                    disabled={isApplying}
                    className="w-full mt-5 h-10"
                  >
                    {isApplying ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={15} className="animate-spin" />
                        Applying...
                      </span>
                    ) : (
                      "Apply Now"
                    )}
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
