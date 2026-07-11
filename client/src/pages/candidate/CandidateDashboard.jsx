import { useEffect, useState } from "react";
import api from "../../api/axios";
import StatCard from "../../components/StatCard";
import { User, Send, Calendar, Bookmark } from "lucide-react";

const CandidateDashboard = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const res = await api.get("/dashboard/candidate");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mt-6">
        <StatCard icon={User} value="65%" label="Profile Complete" to="/profile" color="orange" />
        <StatCard icon={Send} value={data.totalApplied} label="Active Applications" to="/applications" color="blue" trend={`+${data.totalApplied} total`} />
        <StatCard icon={Calendar} value="3" label="Upcoming Interviews" to="/applications" color="purple" />
        <StatCard icon={Bookmark} value={data.savedJobsCount} label="Saved Jobs" to="/jobs" color="green" />
      </div>
    </div>
  );
};

export default CandidateDashboard;