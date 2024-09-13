import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { COLORS } from "@/util/enums/colors";

const font = Poppins({
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
        className={`${font.className} text-white h-[100vh] w-[100vw]`}
        style={{ background: COLORS.BG }}
      >
        {children}
      </body>
    </html>
  );
}
