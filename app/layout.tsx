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
  title: "YuSeok Choung's Profile",
  description: "YuSeok Choung | AI Software Engineer",
  openGraph: {
    title: "YuSeok Choung's Profile",
    description: "YuSeok Choung | AI Software Engineer",
    url: baseUrl,
    siteName: "YuSeok Choung's Profile",
    locale: "ko_KR",
    images: [
      {
        url: `${process.env.OCI_BUCKET_READ_URL}og.png`,
        width: 1200,
        height: 630,
        alt: "YuSeok Choung",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YuSeok Choung's Profile",
    description: "YuSeok Choung | AI Software Engineer",
    images: [`${process.env.OCI_BUCKET_READ_URL}og.png`],
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
