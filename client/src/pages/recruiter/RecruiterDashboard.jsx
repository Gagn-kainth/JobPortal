import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import { Briefcase, Users, Calendar, Award } from "lucide-react";

const RecruiterDashboard = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const res = await api.get("/dashboard/recruiter");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Loading...</p>;

  const totalApplicants = data.applicantsPerJob.reduce((a, j) => a + j.count, 0);
  const hiredCount = data.statusBreakdown.find((s) => s._id === "Hired")?.count || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <StatCard icon={Briefcase} value={data.jobsPosted} label="Active Jobs" to="/my-jobs" color="orange" />
        <StatCard icon={Users} value={totalApplicants} label="Total Applicants" to="/applicants" color="blue" />
        <StatCard icon={Calendar} value="18" label="Interviews Scheduled" to="/applicants" color="purple" />
        <StatCard icon={Award} value={hiredCount} label="Hired This Month" to="/applicants" color="green" trend={hiredCount > 0 ? `+${hiredCount}` : undefined} />
      </div>

      <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
        <h3 className="font-semibold mb-4">Hiring Funnel</h3>
        {data.statusBreakdown.map((s) => (
          <div key={s._id} className="mb-3 group">
            <div className="flex justify-between text-sm mb-1">
              <span className="group-hover:text-orange-500 transition-colors">{s._id}</span>
              <span>{s.count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(s.count * 5, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;