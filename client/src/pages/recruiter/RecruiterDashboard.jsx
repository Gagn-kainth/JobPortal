import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import { Briefcase, Users, Calendar, Award } from "lucide-react";

const RecruiterDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/recruiter").then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <StatCard icon={Briefcase} value={data.jobsPosted} label="Active Jobs" />
        <StatCard icon={Users} value={data.applicantsPerJob.reduce((a, j) => a + j.count, 0)} label="Total Applicants" />
        <StatCard icon={Calendar} value="18" label="Interviews Scheduled" />
        <StatCard icon={Award} value={data.statusBreakdown.find(s => s._id === "Hired")?.count || 0} label="Hired This Month" />
      </div>

      <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
        <h3 className="font-semibold mb-4">Hiring Funnel</h3>
        {data.statusBreakdown.map((s) => (
          <div key={s._id} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{s._id}</span>
              <span>{s.count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min(s.count * 5, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;