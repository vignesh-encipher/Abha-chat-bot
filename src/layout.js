import { Inter } from "next/font/google";
import "./globals.css";

// Optimize font loading with display swap
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata = {
  title: "Next.js Performance Optimized App",
  description: "A Next.js application optimized for performance and Lighthouse scores",
  keywords: "Next.js, React, Performance, SEO",
  authors: [{ name: "Your Name" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Next.js Performance Optimized App",
    description: "A Next.js application optimized for performance and Lighthouse scores",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/next.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/vercel.svg" as="image" type="image/svg+xml" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
