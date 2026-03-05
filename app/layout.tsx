import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Long Beach Weather",
  description: "Current weather and forecast for Long Beach, CA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
