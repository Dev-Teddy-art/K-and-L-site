'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageSquare, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/cartStore';
import { useLanguage } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { DISPLAY_PHONE_NUMBER, buildB2BInquiryUrl } from '@/lib/whatsapp';

export function Navbar() {
  const { totalItems, setIsCartOpen, openSimulator, isHydrated } = useCart();
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleQuickWhatsApp = () => {
    const inquiry = buildB2BInquiryUrl(undefined, language);
    openSimulator({
      url: inquiry.url,
      rawText: inquiry.rawText,
      title: t.nav.fulfillmentDesk,
    });
  };

  const navLinks = [
    { href: '#tasting-stage', label: t.nav.tastingStage },
    { href: '#catalog', label: t.nav.catalog },
    { href: '#gift-box', label: t.nav.giftBox },
    { href: '#heritage', label: t.nav.heritage },
    { href: '#wholesale', label: t.nav.wholesale },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF4E8]/95 border-b border-[#E7DAC8] transition-all overflow-x-clip">
      {/* Top Notification Ribbon */}
      <div className="bg-[#6B1713] text-[#FAF4E8] text-[11px] sm:text-xs py-1.5 px-4 text-center tracking-wider font-medium flex items-center justify-center gap-2">
        <span>{t.topRibbon.tagline}</span>
        <span aria-hidden="true" className="opacity-40">·</span>
        <span>{t.topRibbon.subtag}</span>
        <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
        <span className="hidden sm:inline">{t.topRibbon.deskLabel}: {DISPLAY_PHONE_NUMBER}</span>
      </div>

      {/* Main 3-Zone Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[64px] sm:min-h-[72px] py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Brand Wordmark with actual authentic K&L brushwork logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap shrink-0 group py-1"
        >
          <img
            src="/assets/aistudio/K_and_l_site_logo-removebg-preview_ad432b8d.png"
            alt="K&L Logo"
            className="h-8 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-cinzel text-sm sm:text-xl font-bold tracking-widest text-[#35160E] group-hover:text-[#6B1713] transition-colors">
            SPICES
          </span>
        </Link>

        {/* Zone 2: Clean single-line text navigation links (Active on xl+ to prevent overflow) */}
        <nav className="hidden xl:flex items-center gap-5 2xl:gap-8 text-xs 2xl:text-sm font-medium text-[#35160E]/80">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#6B1713] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language & Currency Selectors, Quick Action & Interactive Cart Bag */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Currency Selector: NGN | USD | EUR | GBP */}
          <CurrencySwitcher variant="dropdown" />

          {/* Minimalist Multilingual Dropdown: EN | FR | DE */}
          <LanguageSwitcher variant="dropdown" />

          {/* Fulfillment Desk button (Only on very wide screens 2xl: to prevent crowding) */}
          <button
            onClick={handleQuickWhatsApp}
            className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#6B1713] border border-[#6B1713]/30 rounded-xl hover:bg-[#6B1713]/5 transition-colors whitespace-nowrap shrink-0"
            title="Chat with K&L Spices fulfillment desk"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.nav.fulfillmentDesk}</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            suppressHydrationWarning
            className="relative inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-[#6B1713] text-[#FAF4E8] font-medium text-xs sm:text-sm shadow-md hover:bg-[#55120F] active:scale-[0.98] transition-all whitespace-nowrap shrink-0"
            aria-label={`Shopping Cart with ${isHydrated ? totalItems : 0} items`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline text-xs sm:text-sm font-semibold">{t.nav.orderBag}</span>
            {isHydrated && totalItems > 0 && (
              <span className="ml-0.5 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-full bg-[#FAF4E8] text-[#6B1713] tabular-nums shadow-sm shrink-0">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile & Tablet Navigation Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="xl:hidden p-1.5 sm:p-2 rounded-xl border border-[#E7DAC8] bg-[#F4ECE0] text-[#35160E] hover:bg-[#FAF4E8] transition-colors shrink-0"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Mobile & Tablet Navigation Strip */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#E7DAC8] bg-[#FAF4E8] px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#E7DAC8]/60">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#F4ECE0]/70 text-xs font-semibold text-[#35160E] hover:bg-[#6B1713] hover:text-[#FAF4E8] transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            ))}
          </div>

          {/* Mobile Currency Selector Row */}
          <div className="flex items-center justify-between px-1 py-1">
            <span className="text-xs font-semibold text-[#35160E]/70 font-cinzel">
              Currency:
            </span>
            <CurrencySwitcher variant="segmented" />
          </div>

          {/* Mobile Language Switcher Row */}
          <div className="flex items-center justify-between px-1 py-1">
            <span className="text-xs font-semibold text-[#35160E]/70 font-cinzel">
              Language / Langue:
            </span>
            <LanguageSwitcher variant="segmented" />
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleQuickWhatsApp();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#6B1713]/40 text-[#6B1713] text-xs font-bold hover:bg-[#6B1713]/5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.nav.fulfillmentDesk} ({DISPLAY_PHONE_NUMBER})</span>
          </button>
        </div>
      )}
    </header>
  );
}
