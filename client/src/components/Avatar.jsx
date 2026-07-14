const colors = ["bg-orange-500", "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-pink-500", "bg-indigo-500"];

const Avatar = ({ name, imageUrl, size = 36 }) => {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full ${colors[colorIndex]} text-white flex items-center justify-center text-xs font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
};

export default Avatar;