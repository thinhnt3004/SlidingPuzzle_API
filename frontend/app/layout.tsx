import type { Metadata } from "next";
import "./globals.css"; // <--- DÒNG QUAN TRỌNG NHẤT: Gọi file CSS vào

export const metadata: Metadata = {
  title: "Sliding Puzzle Game",
  description: "Tester Training Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}