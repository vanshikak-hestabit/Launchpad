import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "About",
  description: "About page",
};

export default function RootLayout({ children }) {
  return (

    <div>
      {children}
    </div>
    
  );
}
