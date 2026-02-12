export default function Input({ type = "text", placeholder, value, onChange, className = "" }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg ${className}`}
      required
    />
  );
}
