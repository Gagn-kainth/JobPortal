import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import {
  FileX,
  MapPin,
  Briefcase,
  CalendarDays,
  IndianRupee,
  ChevronRight,
} from "lucide-react";

const statusColors = {
  Pending: "bg-blue-50 text-blue-600 border-blue-100",
  Reviewed: "bg-yellow-50 text-yellow-600 border-yellow-100",
  Shortlisted: "bg-purple-50 text-purple-600 border-purple-100",
  Rejected: "bg-red-50 text-red-600 border-red-100",
  Hired: "bg-green-50 text-green-600 border-green-100",
};

const statusDotColors = {
  Pending: "bg-blue-500",
  Reviewed: "bg-yellow-500",
  Shortlisted: "bg-purple-500",
  Rejected: "bg-red-500",
  Hired: "bg-green-500",
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);

    try {
      const res = await api.get("/applications/my");
      setApplications(res.data);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const withdraw = async (id) => {
    try {
      await api.delete(`/applications/${id}`);

      toast.success("Application withdrawn");

      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch {
      toast.error("Failed to withdraw");
    }
  };

  const formatSalary = (salary) => {
    const num = Number(salary);

    if (!num) return "Salary not specified";

    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    }

    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(0)}K`;
    }

    return `₹${num}`;
  };

  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>

          <p className="text-sm text-gray-500 mt-1">
            Track and manage your job applications
          </p>
        </div>

        {!loading && applications.length > 0 && (
          <span className="text-sm text-gray-400">
            {applications.length}{" "}
            {applications.length === 1 ? "application" : "applications"}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-3" />

                  <div className="flex gap-3 mt-4">
                    <div className="h-3 bg-gray-200 rounded w-20" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>

                <div className="h-8 bg-gray-200 rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        /* Empty State */
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-5">
              <FileX size={30} className="text-orange-400" />
            </div>

            <h3 className="font-semibold text-gray-800">No applications yet</h3>

            <p className="text-sm text-gray-400 mt-1 max-w-sm">
              You haven't applied to any jobs yet. Browse available jobs and
              submit your first application.
            </p>

            <Button
              onClick={() => (window.location.href = "/jobs")}
              className="mt-5 px-5"
            >
              Browse Jobs
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      ) : (
        /* Applications */
        <div className="mt-6 space-y-3">
          {applications.map((app) => {
            const status = app.status || "Pending";

            return (
              <div
                key={app._id}
                className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
             hover:bg-orange-100 hover:border-orange-500 hover:shadow-lg
             hover:scale-[1.02]
             transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      {/* Job Icon */}
                      <div
                        className="w-11 h-11 rounded-xl bg-orange-50
                                   flex items-center justify-center shrink-0
                                   group-hover:bg-orange-500 transition-colors"
                      >
                        <Briefcase
                          size={19}
                          className="text-orange-500 group-hover:text-white transition-colors duration-200"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {app.job?.title || "Job position"}
                        </h3>

                        <p className="text-sm text-gray-500 mt-0.5 truncate">
                          {app.job?.company || "Company"}
                        </p>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 ml-14 text-xs text-gray-500">
                      {app.job?.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-gray-400" />
                          {app.job.location}
                        </span>
                      )}

                      {app.job?.jobType && (
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={14} className="text-gray-400" />
                          {app.job.jobType}
                        </span>
                      )}

                      {app.job?.salary && (
                        <span className="flex items-center gap-1.5">
                          <IndianRupee size={14} className="text-gray-400" />
                          {formatSalary(app.job.salary)}
                        </span>
                      )}

                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-gray-400" />
                        Applied {formatDate(app.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Status + Action */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
                    {/* Status */}
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5
                                  rounded-full text-xs font-medium border
                                  ${
                                    statusColors[status] || statusColors.Pending
                                  }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          statusDotColors[status] || statusDotColors.Pending
                        }`}
                      />

                      {status}
                    </span>

                    {/* Withdraw */}
                    {status !== "Hired" && status !== "Rejected" && (
                      <Button
                        variant="danger"
                        onClick={() => withdraw(app._id)}
                        className="px-3! py-1.5! text-xs! opacity-80 hover:opacity-100"
                      >
                        Withdraw
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
