import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Image from "next/image";

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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} text-text-dark antialiased`}>
        <header className="sticky top-0 z-50 bg-[var(--primary-purple-light)] h-14 flex items-center px-6">
          <div className="flex items-center gap-2">
            <Image 
              src="/kuvio-logos/logo-light.svg" 
              alt="Kuvio" 
              width={104} 
              height={15} 
            />
            <span className="text-white/60 text-sm ml-2 border-l border-white/20 pl-2">
              Feed Validator
            </span>
          </div>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
