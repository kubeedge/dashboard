import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from 'next/headers';

import ThemeRegistry from "@/component/Layout/ThemeRegistry";
import LayoutSwitcher from "@/component/Layout/LayoutSwitcher";
import { AppProvider } from "@/component/Common/AppContext";
import I18nProvider from "@/component/I18nProvider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KubeEdge Dashboard",
  description: "Unified Dashboard Layout",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = headers();
  const initialLanguage = h.get('x-lang') || 'en';
  return (
    <html lang={initialLanguage}>
      <body className={inter.className}>
        <I18nProvider initialLanguage={initialLanguage}>
          <ThemeRegistry>
            <AppProvider >
              <LayoutSwitcher >
                {children}
              </LayoutSwitcher>
            </AppProvider>
          </ThemeRegistry>
        </I18nProvider>
      </body>
    </html>
  );
}
