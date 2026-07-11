import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Eye, Pencil } from "lucide-react";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs/my-jobs").then((res) => setJobs(res.data.jobs));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">My Jobs</h1>
      <table className="w-full mt-6 bg-white rounded-xl overflow-hidden">
        <thead className="text-left text-sm text-gray-500 border-b">
          <tr>
            <th className="p-4">Position</th>
            <th>Location</th>
            <th>Type</th>
            <th>Salary</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-b">
              <td className="p-4">
                <p className="font-medium">{job.title}</p>
              </td>
              <td>{job.location}</td>
              <td>{job.jobType}</td>
              <td>${job.salary}</td>
              <td>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">Active</span>
              </td>
              <td className="flex gap-3 py-4">
                <Eye size={16} className="cursor-pointer text-gray-400" />
                <Pencil size={16} className="cursor-pointer text-gray-400" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyJobs;