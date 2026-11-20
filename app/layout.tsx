import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "docuAI - AI powered multi-tenant document analysis",
  description: "Analyze and collaborate on documents with Google Gemini AI",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster />
        {/* Header */}
        <Header />
        {/* main */}
        <main className="flex-1">{children}</main>
        {/* footer */}
        <Footer />
      </body>
    </html>
  );
}
