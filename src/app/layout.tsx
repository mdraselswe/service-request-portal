import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Service Request Portal",
    template: "%s | Service Request Portal",
  },
  description:
    "A secure workspace for reviewing and managing internal service requests.",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#087f73",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
