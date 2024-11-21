import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

declare global {
  interface Number {
    toLocaleString(): string;
  }
}

// Configure number formatting globally
Number.prototype.toLocaleString = function() {
  return new Intl.NumberFormat('en-US', {
    useGrouping: true,
  }).format(Number(this)).replace(/,/g, ' ');
};

export const metadata: Metadata = {
  title: "Feed Validator | Kuvio",
  description: "Validate and analyze your product feed data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-white text-text-dark antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
