import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const statusColors = {
  Pending: "bg-blue-100 text-blue-600",
  Reviewed: "bg-yellow-100 text-yellow-600",
  Shortlisted: "bg-purple-100 text-purple-600",
  Rejected: "bg-red-100 text-red-600",
  Hired: "bg-green-100 text-green-600",
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    const res = await api.get("/applications/my");
    setApplications(res.data);
  };

  useEffect(() => { fetchApplications(); }, []);

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
      <div className="mt-6 space-y-3">
        {applications.map((app) => (
          <div key={app._id} className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{app.job?.title}</h3>
              <p className="text-sm text-gray-500">{app.job?.location} · {app.job?.jobType}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs ${statusColors[app.status]}`}>
                {app.status}
              </span>
              <button onClick={() => withdraw(app._id)} className="text-sm text-red-500">
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;