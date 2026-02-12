export default function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`py-4 px-8 rounded-xl text-lg font-semibold transition ${className}`}
    >
      {children}
    </button>
  );
}
