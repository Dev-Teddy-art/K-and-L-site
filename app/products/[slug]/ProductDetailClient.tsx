'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Flame,
  ShoppingBag,
  Send,
  Compass,
  Check,
  ShieldCheck,
  Plus,
  Minus,
  MessageSquare,
} from 'lucide-react';
import { ProductSKU } from '@/data/catalog';
import { getLocalizedProduct } from '@/data/catalogI18n';
import { useCart } from '@/lib/cartStore';
import { useLanguage } from '@/lib/i18n';
import { buildSingleItemOrderUrl } from '@/lib/whatsapp';

export function ProductDetailClient({ product }: { product: ProductSKU }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState<string | null>(null);
  const { addItem, openSimulator } = useCart();
  const { t, language } = useLanguage();

  const localized = getLocalizedProduct(product, language);
  const isB2B = localized.category === 'Bulk & Export' || localized.price === null;
  const totalPrice = localized.price ? localized.price * quantity : null;

  const images = [
    { url: localized.dishImage || '/images/heritage_banner.jpg', label: 'Craft Blend' },
    ...(localized.secondaryImage && localized.secondaryImage !== localized.dishImage
      ? [{ url: localized.secondaryImage, label: 'Packaging / Detail' }]
      : localized.pouchImage && localized.pouchImage !== localized.dishImage
      ? [{ url: localized.pouchImage, label: 'Packaging Pouch' }]
      : []),
  ];

  const currentDisplayImage = selectedImgUrl || images[0].url;

  const handleAddToCart = () => {
    addItem(localized, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleWhatsAppOrder = () => {
    const orderData = buildSingleItemOrderUrl(localized, quantity, language);
    openSimulator({
      url: orderData.url,
      rawText: orderData.rawText,
      title: `${isB2B ? t.catalog.quoteButton : t.catalog.orderButton}: ${localized.name}`,
    });
  };

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-[#35160E]/60">
        <Link href="/" className="hover:text-[#6B1713] transition-colors flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.productModal.backToCatalog}</span>
        </Link>
        <span>/</span>
        <span>{localized.category}</span>
        <span>/</span>
        <span className="text-[#35160E] font-semibold">{localized.name}</span>
      </nav>

      {/* Contiguous Purchase Module Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Product Dish Presentation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-square sm:aspect-4/3 rounded-3xl overflow-hidden bg-[#F4ECE0] border border-[#E7DAC8] shadow-lg">
            <img
              src={currentDisplayImage}
              alt={localized.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Packaging / angle pills on top left */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 z-20 flex gap-1.5 bg-black/50 backdrop-blur-md p-1 rounded-xl">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImgUrl(img.url)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                      currentDisplayImage === img.url
                        ? 'bg-[#FAF4E8] text-[#6B1713] shadow-xs'
                        : 'text-[#FAF4E8]/85 hover:text-white'
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            )}

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <span className="px-3.5 py-1.5 rounded-full bg-[#6B1713] text-[#FAF4E8] text-xs font-bold uppercase tracking-wider font-cinzel shadow-md">
                {localized.packaging}
              </span>
              <span className="text-xs text-[#FAF4E8] bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full font-medium">
                {t.productModal.milledInNigeria}
              </span>
            </div>
          </div>

          {/* Multi-angle & Pouch Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImgUrl(img.url)}
                  className={`flex items-center gap-2.5 p-1.5 rounded-2xl border transition-all text-xs font-semibold ${
                    currentDisplayImage === img.url
                      ? 'border-[#6B1713] bg-[#FAF4E8] ring-2 ring-[#6B1713]/30 text-[#6B1713]'
                      : 'border-[#E7DAC8] bg-[#F4ECE0] text-[#35160E]/70 hover:bg-[#FAF4E8]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/50">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="pr-2">{img.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Sourcing & Provenance Card */}
          <div className="p-6 rounded-2xl bg-[#F4ECE0]/70 border border-[#E7DAC8] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#35160E]/60 uppercase tracking-widest font-semibold block">
                {t.productModal.nativeOrigin}
              </span>
              <span className="text-sm font-bold text-[#35160E] mt-0.5 block">
                {localized.origin}
              </span>
            </div>
            <div className="p-3 rounded-full bg-[#FAF4E8] border border-[#E7DAC8] text-[#6B1713]">
              <Compass className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-[#FAF4E8] rounded-3xl p-6 sm:p-8 border border-[#E7DAC8] shadow-sm space-y-6 lg:sticky lg:top-28">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#6B1713] font-bold font-cinzel block mb-1">
              {localized.category}
            </span>
            <h1 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#35160E] leading-snug">
              {localized.name}
            </h1>
            <p className="text-sm text-[#35160E]/75 italic mt-1">&ldquo;{localized.subtitle}&rdquo;</p>
          </div>

          {/* Price & Heat Index Bar */}
          <div className="flex items-center justify-between py-3.5 px-4 bg-[#F4ECE0] rounded-2xl border border-[#E7DAC8]">
            <div>
              <span className="text-[10px] text-[#35160E]/60 uppercase tracking-widest block font-semibold">
                {t.productModal.unitPricing}
              </span>
              <span className="text-2xl font-bold text-[#6B1713] tabular-nums font-cinzel">
                {localized.priceDisplay}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#35160E]/60 uppercase tracking-widest block font-semibold">
                {t.productModal.heatRating}
              </span>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Flame
                    key={i}
                    className={`w-4 h-4 ${
                      i < localized.heatIndex
                        ? 'text-[#6B1713] fill-[#6B1713]'
                        : 'text-[#E7DAC8]'
                    }`}
                  />
                ))}
                <span className="text-xs font-semibold text-[#35160E] ml-1">
                  ({localized.heatIndex}/5)
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#35160E]/90 leading-relaxed">
            {localized.description}
          </p>

          {/* Tasting Notes */}
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#35160E]/70 block mb-2 font-cinzel">
              {t.productModal.characteristics}
            </span>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {localized.tastingNotes.map((note, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-[#F4ECE0] text-[#35160E] text-xs font-medium border border-[#E7DAC8]"
                >
                  {note}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#35160E]/70 italic">
              <strong>{t.productModal.aroma}:</strong> {localized.aromaProfile}
            </p>
          </div>

          {/* Quantity Mutator */}
          {!isB2B && (
            <div className="flex items-center justify-between py-2 border-y border-[#E7DAC8]">
              <span className="text-xs font-bold text-[#35160E] uppercase tracking-wider font-cinzel">
                {t.productModal.quantity}
              </span>
              <div className="flex items-center gap-2 border border-[#E7DAC8] rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1 rounded-lg hover:bg-black/5 text-[#35160E] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-semibold tabular-nums text-[#35160E]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1 rounded-lg hover:bg-black/5 text-[#35160E] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Direct WhatsApp Order & Cart Actions */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#6B1713] text-[#FAF4E8] font-bold text-sm shadow-md hover:bg-[#55120F] active:scale-[0.99] transition-all group"
            >
              <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>
                {isB2B
                  ? t.productModal.requestQuote
                  : `${t.productModal.instantOrder} (${totalPrice ? `₦${totalPrice.toLocaleString()}` : localized.priceDisplay})`}
              </span>
            </button>

            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#35160E]/20 bg-white hover:bg-[#F4ECE0] text-[#35160E] text-xs font-semibold transition-all shadow-xs"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span className="text-emerald-700">{t.productModal.added}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{t.productModal.add} ({quantity})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#35160E]/60 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.hero.zeroSignup}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 'Quick Order via WhatsApp' Floating Action Button */}
      <motion.aside
        initial={{ opacity: 0, y: 35, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.2 }}
        aria-label="Quick Order via WhatsApp"
        className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8"
      >
        <button
          onClick={handleWhatsAppOrder}
          className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-[#6B1713] text-[#FAF4E8] shadow-[0_12px_36px_-6px_rgba(53,22,14,0.45),0_6px_16px_rgba(37,211,102,0.3)] hover:bg-[#55120F] border-2 border-[#FAF4E8]/25 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
          title={`${t.productModal.quickOrderFab} - ${localized.name}`}
        >
          {/* Online desk pulsing beacon */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white/30" />
          </span>

          <MessageSquare className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform shrink-0" />

          <div className="flex flex-col items-start text-left leading-tight">
            <span className="text-[10px] text-[#FAF4E8]/75 uppercase tracking-wider font-cinzel font-semibold hidden min-[360px]:block">
              {t.productModal.quickOrderDeskOnline}
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              {t.productModal.quickOrderFab}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-[#FAF4E8] text-[#6B1713] text-[11px] font-bold font-cinzel tabular-nums shadow-xs">
            {totalPrice ? `₦${totalPrice.toLocaleString()}` : localized.priceDisplay}
          </span>
        </button>
      </motion.aside>
    </div>
  );
}
