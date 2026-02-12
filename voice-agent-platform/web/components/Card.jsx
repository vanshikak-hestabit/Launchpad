export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-2xl rounded-3xl py-16 px-12 flex flex-col justify-center text-center ${className}`}>
      {children}
    </div>
  );
}
