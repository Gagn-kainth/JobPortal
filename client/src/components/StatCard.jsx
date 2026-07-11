import { useNavigate } from "react-router-dom";

const StatCard = ({ icon: Icon, value, label, trend, to, color = "orange" }) => {
  const navigate = useNavigate();

  const colorMap = {
    orange: "bg-orange-100 text-orange-500 group-hover:bg-orange-500",
    blue: "bg-blue-100 text-blue-500 group-hover:bg-blue-500",
    green: "bg-green-100 text-green-500 group-hover:bg-green-500",
    purple: "bg-purple-100 text-purple-500 group-hover:bg-purple-500",
  };

  return (
    <div
      onClick={() => to && navigate(to)}
      className={`group bg-white rounded-xl p-5 shadow-sm border border-transparent transition-all duration-200
        ${to ? "cursor-pointer hover:shadow-lg hover:border-orange-200 hover:-translate-y-1" : ""}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${colorMap[color]}`}>
          <Icon size={20} className="transition-colors duration-200 group-hover:text-white" />
        </div>
        {trend && <span className="text-xs text-green-500 font-medium">{trend}</span>}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};

export default StatCard;