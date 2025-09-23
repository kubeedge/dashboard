

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import ThemeRegistry from "@/components/Layout/ThemeRegistry";
import LayoutSwitcher from "@/components/Layout/LayoutSwitcher";
import { AppProvider } from "@/components/Common/AppContext";

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <AppProvider>
            <LayoutSwitcher>
              {children}
            </LayoutSwitcher>
          </AppProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
