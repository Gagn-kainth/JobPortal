import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  Eye,
  Pencil,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  ChevronRight,
} from "lucide-react";
import SkeletonRow from "../../components/SkeletonRow";

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api
      .get("/jobs/my-jobs")
      .then((res) => setJobs(res.data.jobs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
              <Briefcase className="text-orange-500" size={21} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>

              <p className="text-sm text-gray-500 mt-0.5">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"} posted
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/post-job")}
          className="
            flex items-center justify-center gap-2
            px-4 py-2.5 rounded-xl
            bg-orange-500 text-white
            text-sm font-medium
            hover:bg-orange-600
            hover:scale-105
            shadow-sm hover:shadow-md
            transition-all duration-200
          "
        >
          <Plus size={17} />
          Post New Job
        </button>
      </div>

      {/* Jobs Card */}
      <div
        className="
          mt-6 bg-white rounded-2xl
          shadow-sm border border-gray-100
          overflow-hidden
          hover:border-orange-100
          transition-all duration-200
        "
      >
        {/* Card Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-800">Job Postings</h2>

              <p className="text-xs text-gray-400 mt-1">
                Manage and track your posted jobs
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Active listings
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-200 border-collapse">
            <thead className="text-left text-xs uppercase tracking-wide text-gray-400 bg-gray-50/40">
              <tr>
                <th className="px-5 py-4 font-semibold border-b border-gray-100">
                  Position
                </th>

                <th className="px-5 py-4 font-semibold border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    Location
                  </div>
                </th>

                <th className="px-5 py-4 font-semibold border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} />
                    Type
                  </div>
                </th>

                <th className="px-5 py-4 font-semibold border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={13} />
                    Salary
                  </div>
                </th>

                <th className="px-5 py-4 font-semibold border-b border-gray-100">
                  Status
                </th>

                <th className="px-5 py-4 font-semibold border-b border-gray-100 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} cols={6} />
                ))
              ) : jobs.length === 0 ? (
                /* Empty State */
                <tr>
                  <td colSpan={6} className="py-16 px-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div
                        className="
                          w-16 h-16 rounded-2xl
                          bg-orange-50
                          flex items-center justify-center
                          mb-4
                        "
                      >
                        <Briefcase size={28} className="text-orange-500" />
                      </div>

                      <h3 className="font-semibold text-gray-800">
                        No jobs posted yet
                      </h3>

                      <p className="text-sm text-gray-400 mt-1 max-w-sm">
                        Create your first job posting to start receiving
                        applications from candidates.
                      </p>

                      <button
                        onClick={() => navigate("/post-job")}
                        className="
                          mt-5 flex items-center gap-2
                          px-4 py-2.5 rounded-xl
                          bg-orange-500 text-white
                          text-sm font-medium
                          hover:bg-orange-600
                          hover:scale-105
                          transition-all duration-200
                        "
                      >
                        <Plus size={16} />
                        Post Your First Job
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                /* Jobs */
                jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="
                      group
                      border-b border-gray-100
                      last:border-b-0
                      hover:bg-orange-50
                      transition-all duration-200
                    "
                  >
                    {/* Position */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-10 h-10 rounded-xl
                            bg-orange-50
                            flex items-center justify-center
                            shrink-0
                            group-hover:bg-orange-500
                            group-hover:scale-105
                            transition-all duration-200
                          "
                        >
                          <Briefcase
                            size={17}
                            className="
                              text-orange-500
                              group-hover:text-white
                              transition-colors duration-200
                            "
                          />
                        </div>

                        <div className="min-w-0">
                          <p
                            className="
                              font-semibold text-sm text-gray-800
                              truncate max-w-55
                              group-hover:text-orange-700
                              transition-colors duration-200
                            "
                          >
                            {job.title}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            Posted{" "}
                            {new Date(job.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-gray-400 shrink-0" />
                        <span className="truncate max-w-37.5">
                          {job.location}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span
                        className="
                          inline-flex items-center
                          px-2.5 py-1 rounded-lg
                          bg-gray-100 text-gray-600
                          text-xs font-medium
                          group-hover:bg-white
                          transition-colors duration-200
                        "
                      >
                        {job.jobType}
                      </span>
                    </td>

                    {/* Salary */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        ${Number(job.salary).toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className="
                          inline-flex items-center gap-1.5
                          px-3 py-1.5 rounded-full
                          bg-green-50 text-green-600
                          text-xs font-semibold
                          group-hover:bg-green-100
                          transition-colors duration-200
                        "
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/jobs/${job._id}`)}
                          className="
                            group/action
                            w-9 h-9 rounded-xl
                            bg-gray-50
                            flex items-center justify-center
                            text-gray-400
                            hover:bg-orange-500
                            hover:text-white
                            hover:scale-105
                            transition-all duration-200
                          "
                          title="View job"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => navigate(`/jobs/${job._id}/edit`)}
                          className="
                            group/action
                            w-9 h-9 rounded-xl
                            bg-gray-50
                            flex items-center justify-center
                            text-gray-400
                            hover:bg-orange-500
                            hover:text-white
                            hover:scale-105
                            transition-all duration-200
                          "
                          title="Edit job"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => navigate(`/jobs/${job._id}`)}
                          className="
                            w-9 h-9 rounded-xl
                            bg-gray-50
                            flex items-center justify-center
                            text-gray-400
                            hover:bg-orange-50
                            hover:text-orange-500
                            transition-all duration-200
                          "
                          title="Open"
                        >
                          <ChevronRight size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom */}
        {!loading && jobs.length > 0 && (
          <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/40">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-600">{jobs.length}</span>{" "}
              {jobs.length === 1 ? "job" : "jobs"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
