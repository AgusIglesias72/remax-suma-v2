// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/app-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RE/MAX SUMA - Portal de Propiedades",
  description: "Plataforma para agentes de RE/MAX SUMA. Encuentra y gestiona propiedades en Buenos Aires.",
  keywords: ["inmobiliaria", "propiedades", "remax", "buenos aires", "casas", "departamentos"],
  authors: [{ name: "RE/MAX SUMA" }],
  robots: "index, follow",
  openGraph: {
    title: "RE/MAX SUMA - Portal de Propiedades",
    description: "Encuentra tu propiedad ideal en Buenos Aires con RE/MAX SUMA",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}