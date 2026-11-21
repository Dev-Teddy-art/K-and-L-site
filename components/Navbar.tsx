'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, MessageSquare, Menu, X, ChevronRight, ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/cartStore';
import { useLanguage } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { DISPLAY_PHONE_NUMBER, buildB2BInquiryUrl } from '@/lib/whatsapp';
import { ABOUT_SUBPAGES } from '@/data/about';

export function Navbar() {
  const { totalItems, setIsCartOpen, openSimulator, isHydrated } = useCart();
  const { t, language } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const aboutMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (aboutMenuRef.current && !aboutMenuRef.current.contains(e.target as Node)) {
        setAboutMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickWhatsApp = () => {
    const inquiry = buildB2BInquiryUrl(undefined, language);
    openSimulator({
      url: inquiry.url,
      rawText: inquiry.rawText,
      title: t.nav.fulfillmentDesk,
    });
  };

  const navLinks = [
    { href: '/#catalog', label: t.nav.catalog },
    { href: '/media', label: t.nav.media },
    { href: '/#gift-box', label: t.nav.giftBox },
    { href: '/#heritage', label: t.nav.heritage },
    { href: '/#wholesale', label: t.nav.wholesale },
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[64px] sm:min-h-[72px] py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-6">
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
          <span className="font-montserrat text-sm sm:text-xl font-bold tracking-widest text-[#35160E] group-hover:text-[#6B1713] transition-colors">
            SPICES
          </span>
        </Link>

        {/* Zone 2: Clean single-line text navigation links + About dropdown (Active on xl+ to prevent overflow) */}
        <nav className="hidden xl:flex items-center gap-4 2xl:gap-7 text-xs 2xl:text-sm font-medium text-[#35160E]/80">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#2C5E3B] hover:underline underline-offset-8 decoration-[#2C5E3B]/60 transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </Link>
          ))}

          {/* About Dropdown with 4 Sub-Pages */}
          <div
            ref={aboutMenuRef}
            className="relative"
            onMouseEnter={() => setAboutMenuOpen(true)}
            onMouseLeave={() => setAboutMenuOpen(false)}
          >
            <button
              type="button"
              onClick={() => setAboutMenuOpen((prev) => !prev)}
              aria-expanded={aboutMenuOpen}
              className="inline-flex items-center gap-1 hover:text-[#2C5E3B] transition-colors whitespace-nowrap shrink-0 py-1"
            >
              <span>{t.nav.about}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  aboutMenuOpen ? 'rotate-180 text-[#2C5E3B]' : ''
                }`}
              />
            </button>

            {aboutMenuOpen && (
              <div className="absolute left-0 top-full pt-2 w-60 z-50">
                <div className="bg-[#FAF4E8] rounded-2xl border border-[#E7DAC8] shadow-xl p-2 space-y-1">
                  <Link
                    href="/#about"
                    onClick={() => setAboutMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs font-bold font-montserrat text-[#2C5E3B] hover:bg-[#EBF2EC] transition-colors border-b border-[#E7DAC8]/60 mb-1"
                  >
                    {t.about.overviewLink}
                  </Link>
                  {ABOUT_SUBPAGES.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={sub.href}
                      onClick={() => setAboutMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#35160E] hover:bg-[#2C5E3B] hover:text-[#FAF4E8] transition-colors"
                    >
                      <span>{t.about[sub.key]}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
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
            className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#2C5E3B] border border-[#2C5E3B]/35 bg-[#EBF2EC]/60 rounded-xl hover:bg-[#2C5E3B] hover:text-[#FAF4E8] hover:border-[#2C5E3B] transition-colors whitespace-nowrap shrink-0"
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
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#F4ECE0]/70 text-xs font-semibold text-[#35160E] hover:bg-[#2C5E3B] hover:text-[#FAF4E8] transition-colors"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            ))}
          </div>

          {/* About Sub-Pages Section in Mobile Menu */}
          <div className="pb-2 border-b border-[#E7DAC8]/60 space-y-1.5">
            <span className="block px-1 text-[10px] font-bold uppercase tracking-widest text-[#2C5E3B] font-montserrat">
              {t.nav.about}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ABOUT_SUBPAGES.map((sub) => (
                <Link
                  key={sub.slug}
                  href={sub.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAF4E8] border border-[#E7DAC8] text-xs font-semibold text-[#35160E] hover:bg-[#2C5E3B] hover:text-[#FAF4E8] hover:border-[#2C5E3B] transition-colors"
                >
                  <span className="truncate">{t.about[sub.key]}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Currency Selector Row */}
          <div className="flex items-center justify-between px-1 py-1">
            <span className="text-xs font-semibold text-[#35160E]/70 font-montserrat">
              Currency:
            </span>
            <CurrencySwitcher variant="segmented" />
          </div>

          {/* Mobile Language Switcher Row */}
          <div className="flex items-center justify-between px-1 py-1">
            <span className="text-xs font-semibold text-[#35160E]/70 font-montserrat">
              Language / Langue:
            </span>
            <LanguageSwitcher variant="segmented" />
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleQuickWhatsApp();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#2C5E3B]/40 bg-[#EBF2EC]/60 text-[#2C5E3B] text-xs font-bold hover:bg-[#2C5E3B] hover:text-[#FAF4E8] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.nav.fulfillmentDesk} ({DISPLAY_PHONE_NUMBER})</span>
          </button>
        </div>
      )}
    </header>
  );
}
