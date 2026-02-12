export default function Layout({ children }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      {children}
    </div>
  );
}
