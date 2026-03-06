import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata = {
  title: "AI Companion - AI Powered Conversational Intelligence",
  description:
    "Transform your customer interactions with intelligent voice agents. Automate calls, boost efficiency, and deliver exceptional experiences at scale.",
}

export const viewport = {
  themeColor: "#0891b2",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
