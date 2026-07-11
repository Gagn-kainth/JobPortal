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

const Applicants = () => {
  const [applications, setApplications] = useState([]);

  // NOTE: replace jobId with real selected job id from a job dropdown/list
  const fetchApplicants = async (jobId) => {
    const res = await api.get(`/applications/job/${jobId}`);
    setApplications(res.data.applications);
  };

  const advance = async (id, nextStatus) => {
    try {
      await api.put(`/applications/${id}/status`, { status: nextStatus });
      toast.success("Status updated");
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: nextStatus } : a))
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Applicants</h1>
      <table className="w-full mt-6 bg-white rounded-xl overflow-hidden">
        <thead className="text-left text-sm text-gray-500 border-b">
          <tr>
            <th className="p-4">Candidate</th>
            <th>Applied For</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id} className="border-b">
              <td className="p-4">{app.candidate.name}</td>
              <td>{app.job?.title}</td>
              <td>
                <span className={`px-3 py-1 rounded-full text-xs ${statusColors[app.status]}`}>
                  {app.status}
                </span>
              </td>
              <td>
                <button onClick={() => advance(app._id, "Shortlisted")} className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm">
                  Advance
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Applicants;