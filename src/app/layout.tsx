import type { Metadata } from "next";
import "./globals.css";
import { GlobalUI } from "@/components/layout/GlobalUI";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Build and monitor custom AI tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-[#0D0D0F] text-white antialiased"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <GlobalUI>{children}</GlobalUI>
      </body>
    </html>
  );
}
