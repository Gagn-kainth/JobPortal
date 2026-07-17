import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import { FileX } from "lucide-react";

const statusColors = {
  Pending: "bg-blue-100 text-blue-600",
  Reviewed: "bg-yellow-100 text-yellow-600",
  Shortlisted: "bg-purple-100 text-purple-600",
  Rejected: "bg-red-100 text-red-600",
  Hired: "bg-green-100 text-green-600",
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

  return (
    <div>
      <h1 className="text-2xl font-bold">My Applications</h1>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileX size={48} className="text-gray-200 mb-4" />
          <p className="font-medium text-gray-600">No applications yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Browse jobs and apply to start your journey
          </p>
          <Button
            onClick={() => window.location.href = "/jobs"}
            className="mt-4 h-9 px-6"
          >
            Browse Jobs
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
            >
              {/* Left: Job Info */}
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {app.job?.title}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {app.job?.location} · {app.job?.jobType}
                </p>
              </div>

              {/* Right: Status + Withdraw */}
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[app.status]
                  }`}
                >
                  {app.status}
                </span>
                <Button
                  variant="danger"
                  onClick={() => withdraw(app._id)}
                  className="px-4! py-1.5! text-xs!"
                >
                  Withdraw
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;