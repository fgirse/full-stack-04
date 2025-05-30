import {notFound} from 'next/navigation';
import {Locale, hasLocale, NextIntlClientProvider} from 'next-intl';
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

type Props = {
  children: ReactNode;
  params: Promise<{locale: Locale}>;
};

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

export default async function LocaleLayout({children, params}: Props) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <ClerkProvider>
    <html className="h-full" lang={locale}>
      <body className="roboto.className">
        <NextIntlClientProvider>
          <Header/>
         <Navbar />

         <main className="flex-grow overflow-hidden  flex flex-col">
          {children}
          </main>
          <ScrollToTopButton />
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
