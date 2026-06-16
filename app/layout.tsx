import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";

export const metadata: Metadata = {
  title: "INFS 1101 Python Trainer",
  description: "A self-paced Python practice trainer for INFS 1101.",
  manifest: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/manifest.webmanifest`
};

export const viewport: Viewport = {
  themeColor: "#147f83",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
