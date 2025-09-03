import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/app/components/scrollToTop";
import Navbar from "../components/navbar";
import { UserProvider } from '../components/userContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Demo App",
  description: "Best Institute Management App",
};

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

          <Navbar />
          <ScrollToTop/>

          <main className="pt-20 md:pt-[135px]">{children}</main>
        </body>
      </html>
    </UserProvider>
  );
}
