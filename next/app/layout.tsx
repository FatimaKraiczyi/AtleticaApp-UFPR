"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { MembrosProvider } from "@/hooks/MembrosContext";
import { AuthProvider } from "@/hooks/AuthProvider";
import { CarrinhoProvider } from "@/hooks/CarrinhoContext";
import { AtleticaProvider } from "@/hooks/AtleticaContex";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ display: "flex" }}>
			<AuthProvider>
				<AtleticaProvider>
        <MembrosProvider>
					<CarrinhoProvider>
          <Providers>{children}</Providers>
					</CarrinhoProvider>
        </MembrosProvider>
				</AtleticaProvider>
			</AuthProvider>
      </body>
    </html>
  );
}
