import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import { Briefcase, Users, Calendar, Award } from "lucide-react";

const RecruiterDashboard = () => {
  const [data, setData] = useState(null);
  const [interviews, setInterviews] = useState([]);

  const fetchData = async () => {
    const [dashRes, interviewRes] = await Promise.all([
      api.get("/dashboard/recruiter"),
      api.get("/interviews/recruiter"),
    ]);
    setData(dashRes.data);
    setInterviews(interviewRes.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Loading...</p>;

  const totalApplicants = data.applicantsPerJob.reduce(
    (a, j) => a + j.count,
    0
  );
  const hiredCount =
    data.statusBreakdown.find((s) => s._id === "Hired")?.count || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <StatCard
          icon={Briefcase}
          value={data.jobsPosted}
          label="Active Jobs"
          to="/my-jobs"
          color="orange"
        />
        <StatCard
          icon={Users}
          value={totalApplicants}
          label="Total Applicants"
          to="/applicants"
          color="blue"
        />
        <StatCard
          icon={Calendar}
          value={interviews.length}
          label="Interviews Scheduled"
          to="/applicants"
          color="purple"
        />
        <StatCard
          icon={Award}
          value={hiredCount}
          label="Hired This Month"
          to="/applicants"
          color="green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Hiring Funnel</h3>
          {data.statusBreakdown.map((s) => (
            <div key={s._id} className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>{s._id}</span>
                <span>{s.count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(s.count * 5, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">Upcoming Interviews</h3>
          {interviews.length === 0 ? (
            <p className="text-sm text-gray-400">No interviews scheduled</p>
          ) : (
            <div className="space-y-3">
              {interviews.map((iv) => (
                <div
                  key={iv._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium text-sm">{iv.candidate?.name}</p>
                    <p className="text-xs text-gray-500">{iv.job?.title}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(iv.scheduledAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
