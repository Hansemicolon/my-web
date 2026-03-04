import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "60초대화 - 1분 후 사라지는 익명 대화방",
  description: "60초대화는 1분 후 자동으로 사라지는 익명 채팅 서비스입니다.",
  keywords: ["60초대화", "익명 채팅", "사라지는 채팅", "1분 채팅"],
  verification: {
    google: "0tF688tGvB6wcvTOaABILjZPoHZcXvhaSFjaHeQEIQU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3174828754010881"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
