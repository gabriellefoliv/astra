import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NextAuthSessionProvider from "../providers/sessionProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const metadata: Metadata = {
  title: "Astra",
  description: "SQLite Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <NextAuthSessionProvider>
            {children}
          </NextAuthSessionProvider>
        </body>
    </html>
  );
}
