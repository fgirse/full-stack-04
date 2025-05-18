import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Header from "@/components/header";
import { Navbar } from "@/components/layout/Navbar/navbar";
import Footer from "@/components/layout/Footer/index";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digitale Online School Freiburg",
  description: "Digital Online School Freiburg | Empowering Education, Simplifying Management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <NextIntlClientProvider locale="en">
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="EduSphere | Empowering Education, Simplifying Management." />
          <meta name="keywords" content="Online School, Education, HealhCare" />
          </head>
        <body className={jakarta.className}>
          <Header />
          <Navbar/>
          {children} <main className="content"/> <ToastContainer position="bottom-right" theme="dark" />
          <ScrollToTopButton/>
          <Footer/>
        </body>
      </html>
      </NextIntlClientProvider>
    </ClerkProvider>
  );
}
