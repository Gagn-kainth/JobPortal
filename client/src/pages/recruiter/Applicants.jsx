import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Button from "../../components/Button";
import ScheduleInterviewModal from "../../components/ScheduleInterviewModal";

const BASE_URL = import.meta.env.VITE_API_URL;

const statusColors = {
  Pending: "bg-blue-100 text-blue-600",
  Reviewed: "bg-yellow-100 text-yellow-600",
  Shortlisted: "bg-purple-100 text-purple-600",
  Interviewed: "bg-indigo-100 text-indigo-600",
  Rejected: "bg-red-100 text-red-600",
  Hired: "bg-green-100 text-green-600",
};

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [scheduleFor, setScheduleFor] = useState(null);

  const fetchApplicants = async () => {
    try {
      const res = await api.get("/applications/recruiter/all");
      setApplications(res.data.applications);
    } catch (err) {
      toast.error("Failed to load applicants");
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}/status`, { status });

      toast.success(`Marked as ${status}`);

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        )
      );

      if (status === "Shortlisted") {
        const selectedApplication = applications.find(
          (app) => app._id === id
        );

        if (selectedApplication) {
          setScheduleFor(selectedApplication);
        }
      }
    } catch (err) {
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
            <th>Resume</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td className="p-4 text-gray-400" colSpan={5}>
                No applicants yet
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr
                key={app._id}
                className="border-b transition-colors duration-150 hover:bg-orange-50/50"
              >
                <td className="p-4">{app.candidate?.name}</td>

                <td>{app.job?.title}</td>

                <td>
                  {app.resumeUrl ? (
                    <a
                      href={`${BASE_URL}${app.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 text-sm font-medium hover:underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No resume
                    </span>
                  )}
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      statusColors[app.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>

                <td className="py-3">
                  <div className="flex gap-2 items-center">
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateStatus(app._id, e.target.value)
                      }
                      className="border rounded-lg text-xs px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interviewed">Interviewed</option>
                      <option value="Hired">Hired</option>
                    </select>

                    <Button
                      variant="danger"
                      onClick={() =>
                        updateStatus(app._id, "Rejected")
                      }
                      className="px-3! py-1! text-xs!"
                    >
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {scheduleFor && (
        <ScheduleInterviewModal
          application={scheduleFor}
          onClose={() => setScheduleFor(null)}
          onScheduled={() => setScheduleFor(null)}
        />
      )}
    </div>
  );
};

export default Applicants;