const StatCard = ({ icon: Icon, value, label, trend, color = "orange" }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
          <Icon className={`text-${color}-500`} size={20} />
        </div>
        {trend && <span className="text-xs text-green-500">{trend}</span>}
      </div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
  
  export default StatCard;