'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, ShoppingBag, Send, ArrowRight, RotateCw, Sparkles, Check, Compass, ShieldCheck, ZoomIn } from 'lucide-react';
import { CATALOG, getProductImages } from '@/data/catalog';
import { getLocalizedProduct } from '@/data/catalogI18n';
import { useCart } from '@/lib/cartStore';
import { useLanguage } from '@/lib/i18n';
import { useCurrency } from '@/lib/currencyStore';
import { buildSingleItemOrderUrl } from '@/lib/whatsapp';
import { ProductMacroLightbox } from '@/components/ProductMacroLightbox';

// Filter hero spices (Signature Blends)
const HERO_SPICES = CATALOG.filter((s) => s.isHero);

export function LuxuryHero() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [viewMode, setViewMode] = useState<'primary' | 'secondary'>('primary');
  const [addedNotice, setAddedNotice] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { addItem, openSimulator, setIsCartOpen } = useCart();
  const { t, language } = useLanguage();
  const { formatPrice, isHydrated } = useCurrency();

  const rawSpice = HERO_SPICES[selectedIndex];
  const currentSpice = getLocalizedProduct(rawSpice, language);
  const currentSlides = getProductImages(currentSpice);
  const activeSlide =
    viewMode === 'secondary' && currentSlides.length > 1
      ? currentSlides[1]
      : currentSlides[0];
  const displayPrice =
    currentSpice.price === null
      ? currentSpice.priceDisplay
      : isHydrated
      ? formatPrice(currentSpice.price)
      : currentSpice.priceDisplay;

  const stepAngle = 360 / HERO_SPICES.length;

  const handleSelectSpice = (index: number) => {
    const diff = index - selectedIndex;
    setRotationAngle((prev) => prev + diff * stepAngle);
    setSelectedIndex(index);
    setViewMode('primary');
  };

  const handleManualRotate = (direction: 'cw' | 'ccw') => {
    const nextIndex =
      direction === 'cw'
        ? (selectedIndex + 1) % HERO_SPICES.length
        : (selectedIndex - 1 + HERO_SPICES.length) % HERO_SPICES.length;
    handleSelectSpice(nextIndex);
  };

  const handleDirectWhatsAppBuy = () => {
    const orderData = buildSingleItemOrderUrl(currentSpice, 1, language, displayPrice, displayPrice);
    openSimulator({
      url: orderData.url,
      rawText: orderData.rawText,
      title: `${t.catalog.orderButton}: ${currentSpice.name}`,
    });
  };

  const handleAddToCart = () => {
    addItem(currentSpice, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2200);
  };

  return (
    <section id="tasting-stage" className="relative overflow-hidden pt-8 pb-16 sm:pb-20 md:py-24 bg-[#FAF4E8]">
      {/* Subtle background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#E7DAC8]/40 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Sub-header Badge / Kicker */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <div className="flex justify-center mb-3">
            <img
              src="/assets/aistudio/K_and_l_site_logo-removebg-preview_ad432b8d.png"
              alt="K&L Spices"
              className="h-14 sm:h-18 md:h-20 w-auto object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E7DAC8] bg-[#F4ECE0]/80 text-[#6B1713] text-xs font-semibold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#6B1713]" />
            <span>{t.hero.kicker}</span>
          </div>
          <h1 className="font-montserrat text-2xl min-[380px]:text-3xl sm:text-5xl lg:text-6xl font-bold text-[#35160E] tracking-tight leading-[1.15] text-balance">
            {t.hero.title}
          </h1>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#35160E]/80 max-w-2xl mx-auto leading-relaxed">
            {t.hero.description}
          </p>
        </div>

        {/* 2-Column Showcase: Kinetic Platter (Left/Center) & Flavor Studio Specs (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Column 1: Kinetic Rotating Platter Stage */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative w-full">
            {/* Viewport-contained Platter Container */}
            <div className="relative w-[250px] h-[250px] min-[360px]:w-[280px] min-[360px]:h-[280px] min-[390px]:w-[320px] min-[390px]:h-[320px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] max-w-full flex items-center justify-center">
              {/* Outer Orbital Dashed Halo (continuous 80-second rotation for depth) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-2 border-dashed border-[#E7DAC8] animate-spin-orbital pointer-events-none"
              />

              {/* Secondary decorative orbital ring with subtle coordinate markers */}
              <div
                aria-hidden="true"
                className="absolute inset-4 sm:inset-6 rounded-full border border-[#E7DAC8]/60 pointer-events-none"
              />

              {/* Orbital Spice Selector Satellite Nodes (Desktop / Tablet >= 768px) */}
              {HERO_SPICES.map((spice, idx) => {
                const angle = (idx * 360) / HERO_SPICES.length - 90;
                const radius = 205; // comfortably fits within 460px container
                const isSelected = selectedIndex === idx;

                const leftOffset = Math.round(radius * Math.cos((angle * Math.PI) / 180));
                const topOffset = Math.round(radius * Math.sin((angle * Math.PI) / 180));

                const localizedItem = getLocalizedProduct(spice, language);

                return (
                  <button
                    key={spice.id}
                    onClick={() => handleSelectSpice(idx)}
                    className={`absolute hidden md:flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 z-20 ${
                      isSelected
                        ? 'bg-[#6B1713] text-[#FAF4E8] ring-4 ring-[#FAF4E8] shadow-lg scale-110'
                        : 'bg-[#F4ECE0] text-[#35160E] border border-[#E7DAC8] hover:bg-[#EBF2EC] hover:border-[#2C5E3B]/50 hover:text-[#2C5E3B] hover:scale-105'
                    }`}
                    style={{
                      left: `calc(50% + ${leftOffset}px)`,
                      top: `calc(50% + ${topOffset}px)`,
                    }}
                    title={`Select ${localizedItem.name}`}
                  >
                    <span className="text-xs font-bold font-montserrat">{idx + 1}</span>
                  </button>
                );
              })}

              {/* Central Inertial Spring Platter */}
              <motion.div
                className="relative w-[210px] h-[210px] min-[360px]:w-[230px] min-[360px]:h-[230px] min-[390px]:w-[260px] min-[390px]:h-[260px] sm:w-[340px] sm:h-[340px] md:w-[380px] md:h-[380px] rounded-full p-2 sm:p-3 bg-[#F4ECE0] border-2 border-[#E7DAC8] shadow-[0_25px_60px_-15px_rgba(53,22,14,0.35)] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
                animate={{ rotate: rotationAngle }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                  mass: 0.8,
                }}
              >
                {/* Earthenware Plate Rim Texture */}
                <div
                  onClick={() => setLightboxOpen(true)}
                  title="Click to inspect in 3.5x Macro Studio Lightbox"
                  className="w-full h-full rounded-full overflow-hidden border-3 sm:border-4 border-[#FAF4E8] relative shadow-inner bg-[radial-gradient(circle_at_center,#FAF4E8_0%,#EFE5D4_70%,#E4D5BF_100%)] cursor-zoom-in group"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${currentSpice.id}-${viewMode}`}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.35 }}
                      className={`w-full h-full relative flex items-center justify-center ${
                        activeSlide?.backdrop === 'cutout' ? 'p-5 sm:p-8' : ''
                      }`}
                    >
                      <img
                        src={
                          viewMode === 'secondary' && currentSpice.secondaryImage
                            ? currentSpice.secondaryImage
                            : currentSpice.dishImage || '/images/jollof_dish.jpg'
                        }
                        alt={currentSpice.name}
                        referrerPolicy="no-referrer"
                        className={
                          activeSlide?.backdrop === 'cutout'
                            ? 'w-full h-full object-contain mix-blend-multiply drop-shadow-[0_12px_20px_rgba(53,22,14,0.16)]'
                            : 'w-full h-full object-cover rounded-full'
                        }
                      />
                      {/* Gentle ceramic glaze sheen overlay */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Subtle Macro Zoom hover cue */}
                  <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-[#FAF4E8] text-[10px] font-bold uppercase tracking-wider font-montserrat opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <ZoomIn className="w-3 h-3" />
                    <span>Macro Zoom</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Angle / Packaging toggle if secondary image available */}
            {currentSpice.secondaryImage && currentSpice.secondaryImage !== currentSpice.dishImage && (
              <div className="flex items-center gap-1.5 mt-4 bg-[#F4ECE0] p-1 rounded-full border border-[#E7DAC8] text-[11px] font-semibold">
                <button
                  onClick={() => setViewMode('primary')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    viewMode === 'primary'
                      ? 'bg-[#2C5E3B] text-[#FAF4E8] shadow-xs'
                      : 'text-[#35160E]/70 hover:text-[#2C5E3B]'
                  }`}
                >
                  Authentic Blend
                </button>
                <button
                  onClick={() => setViewMode('secondary')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    viewMode === 'secondary'
                      ? 'bg-[#2C5E3B] text-[#FAF4E8] shadow-xs'
                      : 'text-[#35160E]/70 hover:text-[#2C5E3B]'
                  }`}
                >
                  Detail & Pouch
                </button>
              </div>
            )}

            {/* Manual rotation buttons & label */}
            <div className="flex items-center gap-4 mt-5">
              <button
                onClick={() => handleManualRotate('ccw')}
                className="p-2.5 rounded-full border border-[#E7DAC8] bg-[#FAF4E8] text-[#35160E] hover:bg-[#EBF2EC] hover:border-[#2C5E3B]/50 hover:text-[#2C5E3B] active:scale-95 transition-all shadow-sm"
                aria-label="Rotate previous spice"
              >
                <RotateCw className="w-4 h-4 transform -scale-x-100" />
              </button>

              <span className="text-xs uppercase tracking-widest text-[#35160E]/70 font-semibold font-montserrat">
                {t.hero.blendIndex} {selectedIndex + 1} / {HERO_SPICES.length}
              </span>

              <button
                onClick={() => handleManualRotate('cw')}
                className="p-2.5 rounded-full border border-[#E7DAC8] bg-[#FAF4E8] text-[#35160E] hover:bg-[#EBF2EC] hover:border-[#2C5E3B]/50 hover:text-[#2C5E3B] active:scale-95 transition-all shadow-sm"
                aria-label="Rotate next spice"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal Spice Thumbnails Selector with Real Product Photos */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full pb-2 px-2 scrollbar-none justify-start sm:justify-center">
              {HERO_SPICES.map((spice, idx) => {
                const localizedThumbnail = getLocalizedProduct(spice, language);
                return (
                  <button
                    key={spice.id}
                    onClick={() => handleSelectSpice(idx)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedIndex === idx
                        ? 'bg-[#6B1713] text-[#FAF4E8] shadow-sm ring-2 ring-[#6B1713]/30 scale-105'
                        : 'bg-[#F4ECE0] text-[#35160E]/80 border border-[#E7DAC8] hover:bg-[#EBF2EC]/70 hover:border-[#2C5E3B]/45 hover:text-[#2C5E3B]'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-white/50 block bg-[#EFE5D4]">
                      <img
                        src={spice.dishImage || '/images/jollof_dish.jpg'}
                        alt=""
                        className={`w-full h-full object-cover ${
                          getProductImages(spice)[0]?.backdrop === 'cutout'
                            ? 'mix-blend-multiply'
                            : ''
                        }`}
                      />
                    </span>
                    <span>{localizedThumbnail.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Synchronized Tasting Notes & Instant WhatsApp Dispatch Studio */}
          <div className="lg:col-span-5 bg-[#FAF4E8] rounded-3xl p-6 sm:p-8 border border-[#E7DAC8] shadow-sm flex flex-col justify-between w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSpice.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {/* Category & Packaging Line */}
                <div className="flex items-center justify-between text-xs text-[#35160E]/60 mb-2 font-medium">
                  <span className="text-[#6B1713] font-bold tracking-wider uppercase font-montserrat">
                    {currentSpice.category}
                  </span>
                  <span>{currentSpice.packaging}</span>
                </div>

                {/* SKU Name & Subtitle */}
                <h2 className="font-montserrat text-2xl sm:text-3xl font-bold text-[#35160E] leading-snug">
                  {currentSpice.name}
                </h2>
                <p className="text-sm text-[#35160E]/80 mt-1 italic">
                  &ldquo;{currentSpice.subtitle}&rdquo;
                </p>

                {/* Price & Heat Index Bar */}
                <div className="flex items-center justify-between my-5 py-3 px-4 bg-[#F4ECE0]/80 rounded-2xl border border-[#E7DAC8]/70">
                  <div>
                    <span className="block text-[10px] text-[#35160E]/60 uppercase tracking-widest font-semibold">
                      {t.hero.standardJar}
                    </span>
                    <span className="text-2xl font-bold text-[#6B1713] tabular-nums font-montserrat">
                      {displayPrice}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] text-[#35160E]/60 uppercase tracking-widest font-semibold">
                      {t.hero.heatIndex}
                    </span>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Flame
                          key={i}
                          className={`w-4 h-4 ${
                            i < currentSpice.heatIndex
                              ? 'text-[#6B1713] fill-[#6B1713]'
                              : 'text-[#E7DAC8]'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-semibold text-[#35160E] ml-1">
                        ({currentSpice.heatIndex}/5)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#35160E]/90 leading-relaxed mb-5">
                  {currentSpice.description}
                </p>

                {/* Synchronized Tasting Notes Pills */}
                <div className="mb-5">
                  <span className="block text-xs uppercase tracking-wider font-semibold text-[#35160E]/70 mb-2 font-montserrat">
                    {t.hero.flavorNotes}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSpice.tastingNotes.map((note, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#F4ECE0] text-[#35160E] text-xs font-medium border border-[#E7DAC8]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Culinary Pairing Suggestion */}
                <div className="p-3.5 rounded-xl bg-[#F4ECE0]/50 border border-[#E7DAC8] text-xs text-[#35160E]/80 mb-6">
                  <span className="font-bold text-[#35160E] block mb-0.5 font-montserrat">
                    {t.hero.pairing}
                  </span>
                  {currentSpice.pairingDish}
                </div>

                {/* Origin / Provenance */}
                <div className="flex items-center gap-2 text-xs text-[#35160E]/70 mb-6">
                  <Compass className="w-3.5 h-3.5 text-[#2C5E3B]" />
                  <span>{t.hero.origin}: {currentSpice.origin}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CTAs: WhatsApp Direct Order & Bag Buttons */}
            <div className="space-y-3 pt-3 border-t border-[#E7DAC8]">
              <button
                onClick={handleDirectWhatsAppBuy}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#6B1713] text-[#FAF4E8] font-semibold text-sm shadow-md hover:bg-[#55120F] active:scale-[0.99] transition-all group"
              >
                <Send className="w-4 h-4 text-[#FAF4E8] group-hover:translate-x-0.5 transition-transform" />
                <span>{t.hero.instantBuy} ({displayPrice})</span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#2C5E3B]/35 bg-[#FAF4E8] hover:bg-[#2C5E3B] hover:text-[#FAF4E8] hover:border-[#2C5E3B] text-[#2C5E3B] text-xs font-semibold transition-all"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.hero.addedToBag}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.hero.addToBag}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#EBF2EC]/75 border border-[#2C5E3B]/30 hover:bg-[#2C5E3B] hover:text-[#FAF4E8] hover:border-[#2C5E3B] text-[#2C5E3B] text-xs font-semibold transition-all"
                >
                  <span>{t.hero.reviewBag}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#35160E]/60 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2C5E3B]" />
                <span>{t.hero.zeroSignup}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Inspection Lightbox for Hero Platter */}
      <ProductMacroLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={currentSlides}
        initialIndex={viewMode === 'secondary' && currentSlides.length > 1 ? 1 : 0}
        productName={currentSpice.name}
        packaging={currentSpice.packaging}
        origin={currentSpice.origin}
      />
    </section>
  );
}
