import './globals.css';

export const metadata = {
  title: 'Voice Agent Platform',
  description: 'AI Voice Agent App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans flex items-center justify-center min-h-screen">
        {children}
      </body>
    </html>
  );
}
