import { useNavigate } from "react-router-dom";

const StatCard = ({
  icon: Icon,
  value,
  label,
  trend,
  to,
  color = "orange",
}) => {
  const navigate = useNavigate();

  const colorMap = {
    orange: {
      card: "hover:bg-orange-100",
      icon: "bg-orange-400 text-orange-900",
    },
    blue: {
      card: "hover:bg-blue-100",
      icon: "bg-blue-400 text-blue-900",
    },
    green: {
      card: "hover:bg-green-100",
      icon: "bg-green-400 text-green-900",
    },
    purple: {
      card: "hover:bg-purple-100",
      icon: "bg-purple-400 text-purple-900",
    },
  };

  const selectedColor = colorMap[color];

  return (
    <div
      onClick={() => to && navigate(to)}
      className={`
        group
        relative
        overflow-hidden
        bg-white
        rounded-2xl
        p-5 md:p-6

        shadow-[0_4px_20px_rgba(0,0,0,0.06)]

        transition-all
        duration-300

        ${selectedColor.card}

        ${
          to
            ? `
              cursor-pointer
              hover:-translate-y-1
              hover:shadow-[0_15px_35px_rgba(0,0,0,0.12)]
            `
            : ""
        }
      `}
    >
      {/* Top Section */}
      <div className="flex items-start justify-between mb-5">
        {/* Icon */}
        <div
          className={`
            w-12 h-12
            rounded-xl
            flex items-center justify-center

            ${selectedColor.icon}

            transition-all
            duration-300

            group-hover:scale-110
          `}
        >
          <Icon size={22} />
        </div>

        {/* Trend */}
        {trend && (
          <span
            className="
              px-3 py-1
              rounded-full
              bg-green-100
              text-green-700
              text-xs
              font-semibold
            "
          >
            {trend}
          </span>
        )}
      </div>

      {/* Stats */}
      <div>
        <p className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          {value}
        </p>

        <p className="mt-1 text-sm text-gray-500">{label}</p>
      </div>

      {/* Arrow */}
      {to && (
        <div
          className="
            absolute
            right-5
            bottom-5

            text-gray-300

            opacity-0
            translate-x-2

            group-hover:opacity-100
            group-hover:translate-x-0
            group-hover:text-gray-700

            transition-all
            duration-300
          "
        >
          →
        </div>
      )}
    </div>
  );
};

export default StatCard;
