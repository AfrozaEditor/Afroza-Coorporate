import type { Metadata } from "next";
import "./styles/globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Afroza Editor — Solutions numériques au Cameroun",
  description:
    "Afroza Editor conçoit des solutions web, mobiles et digitales innovantes pour les entreprises au Cameroun.",


  verification: {
    google: "qmQApfJmp4jwt8m3oNtTot7nGNwfsOfLgMnD4FfPkXQ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <Header/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}
