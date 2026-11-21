import type { Metadata } from 'next';
import { Cinzel, Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from '@/components/Providers';
// @ts-expect-error Next.js handles global CSS imports; no TypeScript module declaration is needed.
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'K&L Spices | Artisanal West African Heritage Spices',
  description:
    'Small-batch, stone-milled native seasonings, single-origin peppers, and raw export commodities from West Africa. Direct WhatsApp conversion & fulfillment desk.',
  keywords: [
    'K&L Spices',
    'Jollof Rice Spice Mix',
    'Yaji Suya Pepper',
    'Nigerian Native Soup Spice',
    'Pepper Soup Spice',
    'West African Spices',
    'Stone-milled spices',
    'Export Spices',
  ],
  openGraph: {
    title: 'K&L Spices | Artisanal West African Heritage Spices',
    description:
      'Artisanal West African heritage seasonings stone-milled in small batches. Experience our kinetic tasting platter & direct WhatsApp ordering.',
    type: 'website',
    images: [
      {
        url: '/images/heritage_banner.jpg',
        width: 1200,
        height: 675,
        alt: 'K&L Spices Artisanal Heritage Seasonings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K&L Spices | Artisanal West African Heritage Spices',
    description:
      'Artisanal West African heritage seasonings stone-milled in small batches. Order directly via WhatsApp.',
    images: ['/images/heritage_banner.jpg'],
  },
  icons: {
    icon: '/assets/aistudio/K_and_l_site_logo-removebg-preview_ad432b8d.png',
    apple: '/assets/aistudio/K_and_l_site_logo-removebg-preview_ad432b8d.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'K&L Spices Heritage Spice Collection',
  description:
    'Curated stone-milled West African seasoning blends, pure root powders, and export commodities.',
  numberOfItems: 13,
  itemListElement: [
    {
      '@type': 'Product',
      position: 1,
      name: 'Jollof Rice Spice Mix',
      description: 'Signature artisanal stone-milled West African Jollof rice seasoning in 100g glass jar.',
      offers: {
        '@type': 'Offer',
        price: '3500',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'Product',
      position: 2,
      name: 'Nigerian Native Soup Spice',
      description: 'Heritage aromatic native soup spice blend for authentic coastal broths in 100g glass jar.',
      offers: {
        '@type': 'Offer',
        price: '3500',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
      },
    },
    {
      '@type': 'Product',
      position: 3,
      name: 'Yaji Suya Pepper',
      description: 'Authentic stone-ground Northern Nigerian Suya rub with roasted peanuts and ginger in 100g glass jar.',
      offers: {
        '@type': 'Offer',
        price: '3000',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${jakarta.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FAF4E8] text-[#35160E] min-h-screen antialiased selection:bg-[#6B1713] selection:text-[#FAF4E8]" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
