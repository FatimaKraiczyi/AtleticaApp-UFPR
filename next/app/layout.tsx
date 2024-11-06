"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { MembrosProvider } from "@/hooks/MembrosContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ display: "flex" }}>
        <MembrosProvider>
          <Providers>{children}</Providers>
        </MembrosProvider>
      </body>
    </html>
  );
}
