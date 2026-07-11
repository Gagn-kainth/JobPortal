const variants = {
    primary: "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-sm hover:shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
    ghost: "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
    danger: "bg-white text-red-500 border border-red-200 hover:bg-red-50",
  };
  
  const Button = ({ children, variant = "primary", className = "", ...props }) => (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        transform hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
  
  export default Button;