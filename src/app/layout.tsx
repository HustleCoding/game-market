import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
  title: "3D Public Square Marketplace",
  description: "A virtual 3D marketplace for vendors and visitors",
  // Favicon and app icon metadata
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  // Web manifest
  manifest: "/site.webmanifest",
  // Basic Open Graph/Twitter metadata
  openGraph: {
    title: "3D Public Square Marketplace",
    description: "A virtual 3D marketplace for vendors and visitors",
    url: "https://3d-marketplace.vercel.app",
    siteName: "3D Public Square Marketplace",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "3D Public Square Marketplace - A virtual 3D marketplace for vendors and visitors",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Twitter specific metadata
  twitter: {
    card: "summary_large_image",
    title: "3D Public Square Marketplace",
    description: "A virtual 3D marketplace for vendors and visitors",
    images: ["/og-image.jpg"],
    creator: "@yourusername",
  },
  // Other metadata
  applicationName: "3D Marketplace",
  appleWebApp: {
    capable: true,
    title: "3D Marketplace",
    statusBarStyle: "black-translucent",
  },
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  colorScheme: "light dark",
  creator: "Your Name",
  publisher: "Your Company",
  robots: "index, follow",
  alternates: {
    canonical: "https://3d-marketplace.vercel.app",
  },
  keywords: ["3D", "marketplace", "virtual", "shopping", "vendors"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
