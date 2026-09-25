import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SrokHotel - Boutique Hotel & PMS Management",
  description: "Modern Hotel & Guest House Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
