import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/ThemeProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? new URL(`https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`)
      : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: "AI Software Engineer - YuSeok Choung",
  description: "YuSeok Choung | AI Software Engineer Profile",
  openGraph: {
    title: "AI Software Engineer - YuSeok Choung",
    description: "YuSeok Choung | AI Software Engineer Profile",
    url: baseUrl,
    siteName: "AI Software Engineer - YuSeok Choung",
    locale: "ko_KR",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "YuSeok Choung",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Software Engineer - YuSeok Choung",
    description: "YuSeok Choung | AI Software Engineer Profile",
    images: ["/og.png"],
  },
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
