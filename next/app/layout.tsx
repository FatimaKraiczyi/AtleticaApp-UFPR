"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthProvider } from "@/hooks/AuthProvider";
import { CarrinhoProvider } from "@/hooks/CarrinhoContext";
import { AtleticaProvider } from "@/hooks/AtleticaContex";
import { MembrosProvider } from "@/hooks/MembroContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ display: "flex" }}>
        <ToastContainer position="bottom-right" autoClose={3000} />
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
