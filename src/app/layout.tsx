import type { Metadata } from "next";
import { Caveat, Patrick_Hand } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valentine's Card - Will You Be My Valentine?",
  description: "Create and share a special Valentine's Day card with someone you love!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${caveat.variable} ${patrickHand.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
