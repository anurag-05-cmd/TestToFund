import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutClient from './layout-client';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TestToFund - Learn, Validate, Earn",
  description: "Transform your knowledge into rewards. Watch educational videos, pass validations, and earn TTF tokens on the TestToFund platform.",
  keywords: "TestToFund, TTF tokens, learn to earn, blockchain education, cryptocurrency rewards",
  authors: [{ name: "TestToFund Team" }],
  openGraph: {
    title: "TestToFund - Learn, Validate, Earn",
    description: "Transform your knowledge into rewards with TestToFund",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
