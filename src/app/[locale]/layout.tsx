import {notFound} from 'next/navigation';
import {Locale, hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ReactNode} from 'react';
import {clsx} from 'clsx';
import { Roboto,} from 'next/font/google';
import {routing} from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar/navbar';
import '../globals.css';
import Header from '@/components/header';
import { ClerkProvider } from '@clerk/nextjs';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import Footer from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/sonner" 
import { ToastContainer } from 'react-toastify';
import { dark } from '@clerk/themes';
import { NextIntlClientProvider } from 'next-intl';

const roboto = Roboto({
  subsets: ['latin'],
  weight: '100'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata(props: Omit<Props, 'children'>) {
  const {locale} = await props.params;

  const t = await getTranslations({locale, namespace: 'LocaleLayout'});

  return {
    title: t('title')
  };
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({children, params}: Props) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

return (
    <ClerkProvider
      appearance={{
        baseTheme: dark, // Now properly imported
        variables: {
          colorPrimary: '#your-color',
        },
        elements: {
          formButtonPrimary: 'your-custom-class',
        },
      }}>
      <html className="h-full" lang={locale}>
        <body className={`${roboto.className}`}>
          <NextIntlClientProvider>
            <Header/>
            <Navbar />
            <main className="flex-grow overflow-hidden flex flex-col">
              {children}<ToastContainer position="bottom-right" theme="dark" />
            </main>
            <ScrollToTopButton />
            <Footer />
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )}