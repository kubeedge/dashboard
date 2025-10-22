import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "../component/Layout";
import { headers } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home - kubeedge",
  description: "Kubeedge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = headers();
  const initialLanguage = h.get('x-lang') || 'en';
  return (
    <html lang={initialLanguage}>
      <body className={inter.className}>
        <Layout initialLanguage={initialLanguage}>{children}</Layout>
      </body>
    </html>
  );
}
