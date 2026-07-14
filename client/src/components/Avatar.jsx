const Avatar = ({ name, imageUrl, size = "md" }) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",   // was w-8 h-8 — smaller
    md: "w-9 h-9 text-xs",       // was w-10 h-10
    lg: "w-11 h-11 text-sm",     // was w-12 h-12
  };

  const bgColors = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500",
    "bg-pink-500", "bg-teal-500", "bg-indigo-500", "bg-red-500",
  ];
  const colorIndex = name?.charCodeAt(0) % bgColors.length || 0;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${bgColors[colorIndex]} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
};
export default Avatar;