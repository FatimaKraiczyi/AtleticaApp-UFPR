"use client";

import { Inter } from "next/font/google";
import "../styles/global.css";
import { MembrosProvider } from "@/hooks/MembrosContext";
import { Providers } from "./providers";

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
