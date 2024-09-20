import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { COLORS } from "@/util/enums/colors";

const font = Inter({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Musix",
  description: "Music streaming app which uses YouTube to fetch audio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.className} text-fontColor h-[100vh] w-[100vw]`}
        style={{ background: COLORS.BG }}
      >
        {children}
      </body>
    </html>
  );
}
