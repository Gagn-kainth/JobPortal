import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Eye, Pencil, Briefcase, MapPin, Clock, DollarSign, Plus } from "lucide-react";
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
      <div className="flex items-center justify-between">
      
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <p className="text-sm text-gray-500 mt-1">
            {jobs.length} {jobs.length === 1 ? "job" : "jobs"} posted
          </p>
        
           </div>

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 border-collapse">
            <thead className="text-left text-sm text-gray-500 bg-gray-50/50">
              <tr>
                <th className="p-4 whitespace-nowrap font-medium border-b border-gray-100">
                  Position
                </th>
                <th className="p-4 whitespace-nowrap font-medium border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    Location
                  </div>
                </th>
                <th className="p-4 whitespace-nowrap font-medium border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    Type
                  </div>
                </th>
                <th className="p-4 whitespace-nowrap font-medium border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <DollarSign size={12} />
                    Salary
                  </div>
                </th>
                <th className="p-4 whitespace-nowrap font-medium border-b border-gray-100">
                  Status
                </th>
                <th className="p-4 whitespace-nowrap font-medium border-b border-gray-100 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Briefcase size={40} className="text-gray-300 mb-3" />
                      <p className="font-medium text-gray-600">No jobs posted yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Create your first job posting to start receiving applicants.
                      </p>
          
                    </div>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr
                    key={job._id}
                    className="transition-colors duration-150 hover:bg-orange-50/30 border-b border-gray-100 last:border-b-0"
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-900">
                          {job.title}
                        </span>
                        <span className="text-xs text-gray-400 mt-0.5">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{job.location}</td>
                    <td className="p-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">
                        {job.jobType}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      ${Number(job.salary).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/jobs/${job._id}`)}
                          className="p-2 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors"
                          title="View job"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/jobs/${job._id}/edit`)}
                          className="p-2 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors"
                          title="Edit job"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyJobs;