import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const font = Rubik({
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
      <body className={`${font.className} bg-black/90 text-white`}>
        {children}
      </body>
    </html>
  );
}
