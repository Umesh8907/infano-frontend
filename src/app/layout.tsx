import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://infano.app'), // Replace with actual domain when ready
  title: {
    default: "Infano | Modern Learning Garden for the Awkward Age",
    template: "%s | Infano"
  },
  description: "A premium, gamified learning platform guiding students through the transitions of growing up with care and imagination.",
  keywords: ["learning", "education", "gamified learning", "adolescence", "parenting", "student growth"],
  authors: [{ name: "Infano Team" }],
  creator: "Infano",
  publisher: "Infano",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Infano | Modern Learning Garden",
    description: "Experience the next generation of education. Gamified, nurturing, and beautiful.",
    url: "https://infano.app",
    siteName: "Infano",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infano | Modern Learning Garden",
    description: "Where Imagination Meets Education.",
    creator: "@infano_app",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#f49b82",
};

import AuthGuard from "@/components/shared/AuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <AuthGuard>
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
