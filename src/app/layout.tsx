import "./globals.css";
import { Inter } from "next/font/google";
import ThemeHead from "@/app/ThemeHead";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Markdown to Components Parser",
  description: "Convert markdown files to dynamic React components using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeHead />
        {children}
      </body>
    </html>
  );
}
