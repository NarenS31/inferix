import "./globals.css";
import type { Metadata } from "next";
import { Inter, Syne, Instrument_Serif, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Inferix Dashboard",
  description: "Routing analytics and controls",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Inferix Dashboard",
    description: "Routing analytics and controls",
    images: [
      {
        url: "/brand/app-icon-dark.svg",
        width: 256,
        height: 256,
        alt: "Inferix icon",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Inferix Dashboard",
    description: "Routing analytics and controls",
    images: ["/brand/app-icon-dark.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${syne.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} min-h-screen`}>{children}</body>
    </html>
  );
}
