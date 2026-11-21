'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import {
  Flame,
  ShoppingBag,
  Send,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  LayoutGrid,
  GalleryHorizontalEnd,
  ArrowUpRight,
} from 'lucide-react';
import { CATALOG, ProductSKU, getProductImages } from '@/data/catalog';
import { getLocalizedProduct } from '@/data/catalogI18n';
import { useCart } from '@/lib/cartStore';
import { useLanguage } from '@/lib/i18n';
import { useCurrency } from '@/lib/currencyStore';
import { buildSingleItemOrderUrl } from '@/lib/whatsapp';
import { ProductPhotoCarousel } from '@/components/ProductPhotoCarousel';

type CategoryFilter = 'All' | 'Signature Blends' | 'Pure Powders' | 'Bulk & Export';
type CatalogViewMode = 'carousel' | 'grid';

interface ProductCardProps {
  product: ProductSKU;
  index: number;
  onSelectProduct?: (product: ProductSKU) => void;
  onAddToCart: (product: ProductSKU, e: React.MouseEvent) => void;
  onDirectWhatsApp: (product: ProductSKU, e: React.MouseEvent) => void;
  isRecentlyAdded: boolean;
}

function ProductCard({
  product,
  index,
  onSelectProduct,
  onAddToCart,
  onDirectWhatsApp,
  isRecentlyAdded,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const { t, language } = useLanguage();
  const { formatPrice, isHydrated } = useCurrency();
  const localized = getLocalizedProduct(product, language);
  const isB2B = localized.category === 'Bulk & Export' || localized.price === null;

  const slides = getProductImages(localized);
  const hasMultipleSlides = slides.length > 1;
  const activeSlide = slides[slideIdx % slides.length];

  const handleCycleSlide = (delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIdx((prev) => (prev + delta + slides.length) % slides.length);
  };

  // Track card's vertical passage through viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  // Calculate rhythmic parallax based on grid column position (0, 1, 2)
  const colIndex = index % 3;
  const parallaxDirection = colIndex === 1 ? -1 : 1;
  const parallaxAmount = 14;

  // Kinetic scroll-driven transforms
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxAmount * parallaxDirection, -parallaxAmount * parallaxDirection]
  );
  const rawRotate = useTransform(
    scrollYProgress,
    [0, 1],
    [-10 * parallaxDirection, 10 * parallaxDirection]
  );
  const rawImageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1.04, 0.97]);
  const rawImageY = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  // Spring physics smoothing for luxurious inertial fluidity
  const smoothY = useSpring(rawY, { stiffness: 120, damping: 24 });
  const smoothRotate = useSpring(rawRotate, { stiffness: 100, damping: 22 });
  const smoothScale = useSpring(rawImageScale, { stiffness: 120, damping: 24 });
  const smoothImageY = useSpring(rawImageY, { stiffness: 120, damping: 24 });

  const displayPrice =
    isB2B || localized.price === null
      ? localized.priceDisplay
      : isHydrated
      ? formatPrice(localized.price)
      : localized.priceDisplay;

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelectProduct && onSelectProduct(localized)}
      className="group relative bg-[#FAF4E8] rounded-3xl p-5 sm:p-6 pt-22 border border-[#E7DAC8] shadow-[0_10px_30px_-10px_rgba(53,22,14,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(53,22,14,0.16)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Floating Parallax Platter with Per-Product Photo Carousel */}
      <motion.div
        style={{
          y: smoothY,
          rotate: smoothRotate,
        }}
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full p-1.5 bg-[#FAF4E8] border-2 border-[#E7DAC8] shadow-[0_20px_40px_-10px_rgba(53,22,14,0.32)] group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 z-10 will-change-transform"
      >
        <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner bg-[radial-gradient(circle_at_center,#FAF4E8_0%,#EFE5D4_72%,#E4D5BF_100%)]">
          <motion.div
            style={{
              scale: smoothScale,
              y: smoothImageY,
            }}
            className={`w-full h-full relative will-change-transform flex items-center justify-center ${
              activeSlide.backdrop === 'cutout' ? 'p-2.5' : ''
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeSlide.url}
                src={activeSlide.url}
                alt={`${localized.name} — ${activeSlide.label}`}
                referrerPolicy="no-referrer"
                initial={{ opacity: 0.4, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.4 }}
                transition={{ duration: 0.22 }}
                className={
                  activeSlide.backdrop === 'cutout'
                    ? 'w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500'
                    : 'w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                }
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10 pointer-events-none" />
          </motion.div>
        </div>

        {/* Per-Product Angle Arrows */}
        {hasMultipleSlides && (
          <>
            <button
              type="button"
              onClick={(e) => handleCycleSlide(-1, e)}
              aria-label={`Previous photo for ${localized.name}`}
              className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAF4E8] border border-[#E7DAC8] text-[#35160E] hover:bg-[#2C5E3B] hover:text-[#FAF4E8] hover:border-[#2C5E3B] shadow-md flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-20"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => handleCycleSlide(1, e)}
              aria-label={`Next photo for ${localized.name}`}
              className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAF4E8] border border-[#E7DAC8] text-[#35160E] hover:bg-[#2C5E3B] hover:text-[#FAF4E8] hover:border-[#2C5E3B] shadow-md flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-20"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Platter Slide Dot Indicators */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF4E8] border border-[#E7DAC8] shadow-xs z-20"
            >
              {slides.map((s, idx) => (
                <button
                  key={`${s.url}-${idx}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlideIdx(idx);
                  }}
                  aria-label={`View ${s.label}`}
                  className={`h-1.5 rounded-full transition-all ${
                    slideIdx % slides.length === idx
                      ? 'w-3.5 bg-[#2C5E3B]'
                      : 'w-1.5 bg-[#35160E]/25 hover:bg-[#2C5E3B]/55'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Card Content Top */}
      <div>
        {/* Packaging & Category Line */}
        <div className="flex items-center justify-between text-[11px] text-[#35160E]/60 mb-2">
          <span className="font-semibold text-[#6B1713] uppercase tracking-wider font-montserrat">
            {localized.category}
          </span>
          <span>{localized.packaging}</span>
        </div>

        {/* Title */}
        <h3 className="font-montserrat text-lg font-bold text-[#35160E] group-hover:text-[#6B1713] transition-colors leading-snug">
          {localized.name}
        </h3>
        <p className="text-xs text-[#35160E]/70 line-clamp-2 mt-1.5 mb-4">
          &ldquo;{localized.subtitle}&rdquo;
        </p>

        {/* Heat Meter & Origin */}
        <div className="flex items-center justify-between text-xs py-2 px-3 bg-[#F4ECE0] rounded-xl border border-[#E7DAC8]/60 mb-4">
          <div className="flex items-center gap-1">
            <Flame
              className={`w-3.5 h-3.5 ${
                localized.heatIndex > 0
                  ? 'text-[#6B1713] fill-[#6B1713]'
                  : 'text-[#E7DAC8]'
              }`}
            />
            <span className="text-[11px] font-medium text-[#35160E]">
              {localized.heatLabel}
            </span>
          </div>

          <span className="text-[11px] text-[#35160E]/60 font-medium">
            {localized.origin.split(',')[0]}
          </span>
        </div>

        {/* Tasting Notes Tags */}
        <div className="flex flex-wrap gap-1 mb-5">
          {localized.tastingNotes.slice(0, 3).map((note, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF4E8] text-[#35160E]/80 border border-[#E7DAC8]"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer: Price & Direct Actions */}
      <div className="pt-4 border-t border-[#E7DAC8] flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] text-[#35160E]/60 uppercase tracking-widest font-semibold truncate">
            {isB2B ? t.catalog.commercial : t.catalog.standard}
          </span>
          <span className="text-base sm:text-lg font-bold text-[#35160E] tabular-nums font-montserrat block truncate">
            {displayPrice}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => onAddToCart(localized, e)}
            className="p-2 sm:p-2.5 rounded-xl border border-[#2C5E3B]/35 bg-[#EBF2EC]/65 hover:bg-[#2C5E3B] hover:text-[#FAF4E8] hover:border-[#2C5E3B] text-[#2C5E3B] transition-all shrink-0"
            title="Add to order bag"
          >
            {isRecentlyAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={(e) => onDirectWhatsApp(localized, e)}
            className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-[#6B1713] text-[#FAF4E8] hover:bg-[#55120F] text-xs font-semibold shadow-sm transition-all whitespace-nowrap shrink-0"
            title={isB2B ? t.catalog.quoteButton : t.catalog.orderButton}
          >
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span>{isB2B ? t.catalog.quoteButton : t.catalog.orderButton}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function AnimatedCatalog({
  onSelectProduct,
}: {
  onSelectProduct?: (product: ProductSKU) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [viewMode, setViewMode] = useState<CatalogViewMode>('carousel');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const { addItem, openSimulator } = useCart();
  const { t, language } = useLanguage();
  const { formatPrice, isHydrated } = useCurrency();

  const filteredProducts =
    activeCategory === 'All'
      ? CATALOG
      : CATALOG.filter((p) => p.category === activeCategory);

  const safeIndex =
    filteredProducts.length > 0
      ? Math.min(carouselIndex, filteredProducts.length - 1)
      : 0;
  const activeRawProduct = filteredProducts[safeIndex] || CATALOG[0];
  const activeProduct = getLocalizedProduct(activeRawProduct, language);
  const activeIsB2B =
    activeProduct.category === 'Bulk & Export' || activeProduct.price === null;

  const activePriceDisplay =
    activeIsB2B || activeProduct.price === null
      ? activeProduct.priceDisplay
      : isHydrated
      ? formatPrice(activeProduct.price)
      : activeProduct.priceDisplay;

  const handleCategoryChange = (category: CategoryFilter) => {
    setActiveCategory(category);
    setCarouselIndex(0);
  };

  const handlePrevProduct = () => {
    setCarouselIndex(
      (safeIndex - 1 + filteredProducts.length) % filteredProducts.length
    );
  };

  const handleNextProduct = () => {
    setCarouselIndex((safeIndex + 1) % filteredProducts.length);
  };

  const handleAddToCart = (product: ProductSKU, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addItem(product, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 2000);
  };

  const handleDirectWhatsApp = (product: ProductSKU, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const unitDisplay =
      isHydrated && product.price !== null ? formatPrice(product.price) : undefined;
    const orderData = buildSingleItemOrderUrl(product, 1, language, unitDisplay, unitDisplay);
    openSimulator({
      url: orderData.url,
      rawText: orderData.rawText,
      title: `${t.catalog.orderButton}: ${product.name}`,
    });
  };

  const categoryTabLabels: { key: CategoryFilter; label: string }[] = [
    { key: 'All', label: t.catalog.filterAll },
    { key: 'Signature Blends', label: t.catalog.filterSignature },
    { key: 'Pure Powders', label: t.catalog.filterPowders },
    { key: 'Bulk & Export', label: t.catalog.filterBulk },
  ];

  return (
    <section id="catalog" className="py-20 md:py-28 bg-[#F4ECE0]/60 relative overflow-x-clip">
      {/* Subtle background ambient kinetic elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-10 w-96 h-96 rounded-full bg-[#E7DAC8]/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-10 w-96 h-96 rounded-full bg-[#E7DAC8]/30 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs uppercase tracking-widest text-[#6B1713] font-bold font-montserrat block mb-2">
            {t.catalog.tagline}
          </span>
          <h2 className="font-montserrat text-3xl sm:text-4xl font-bold text-[#35160E] tracking-tight">
            {t.catalog.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#35160E]/75 leading-relaxed">
            {t.catalog.description}
          </p>

          {/* Filter & View Switcher Toolbar */}
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-3">
            {/* Interactive Category Filter Tabs */}
            <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 bg-[#FAF4E8] rounded-2xl border border-[#E7DAC8] shadow-sm max-w-full overflow-x-auto scrollbar-none">
              {categoryTabLabels.map((tab) => {
                const isActive = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleCategoryChange(tab.key)}
                    className={`relative px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors z-10 ${
                      isActive ? 'text-[#FAF4E8]' : 'text-[#35160E]/75 hover:text-[#2C5E3B]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCatalogPill"
                        className="absolute inset-0 bg-[#6B1713] rounded-xl z-[-1] shadow-sm"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Carousel / Grid View Mode Toggle */}
            <div className="inline-flex items-center gap-1 p-1.5 bg-[#FAF4E8] rounded-2xl border border-[#E7DAC8] shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('carousel')}
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors z-10 ${
                  viewMode === 'carousel'
                    ? 'text-[#FAF4E8]'
                    : 'text-[#35160E]/75 hover:text-[#2C5E3B]'
                }`}
              >
                {viewMode === 'carousel' && (
                  <motion.div
                    layoutId="activeViewModePill"
                    className="absolute inset-0 bg-[#2C5E3B] rounded-xl z-[-1] shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <GalleryHorizontalEnd className="w-3.5 h-3.5" />
                <span>{t.catalog.viewCarousel}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`relative inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors z-10 ${
                  viewMode === 'grid'
                    ? 'text-[#FAF4E8]'
                    : 'text-[#35160E]/75 hover:text-[#2C5E3B]'
                }`}
              >
                {viewMode === 'grid' && (
                  <motion.div
                    layoutId="activeViewModePill"
                    className="absolute inset-0 bg-[#2C5E3B] rounded-xl z-[-1] shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{t.catalog.viewGrid}</span>
              </button>
            </div>
          </div>
        </div>

        {/* MODE 1: Catalog Carousel with Photo Showcase Left & Description Alongside Right */}
        {viewMode === 'carousel' ? (
          <div className="space-y-6">
            <div className="bg-[#FAF4E8] rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#E7DAC8] shadow-[0_20px_50px_-15px_rgba(53,22,14,0.12)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* Left Column: Per-Product Photo & Multi-Angle Carousel */}
                <div className="lg:col-span-6 space-y-4">
                  <ProductPhotoCarousel
                    key={activeProduct.id}
                    images={getProductImages(activeProduct)}
                    alt={activeProduct.name}
                    packaging={activeProduct.packaging}
                    origin={activeProduct.origin}
                    aspectClass="aspect-square sm:aspect-4/3"
                    showThumbnails={true}
                    enableLightbox={true}
                    bottomLeftBadge={
                      <span className="px-3 py-1 rounded-full bg-[#6B1713] text-[#FAF4E8] text-[11px] font-bold uppercase tracking-wider font-montserrat shadow-md">
                        {activeProduct.packaging}
                      </span>
                    }
                    bottomRightBadge={
                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[#FAF4E8] text-[11px] font-medium">
                        {safeIndex + 1} {t.catalog.productOf} {filteredProducts.length}
                      </span>
                    }
                  />
                </div>

                {/* Right Column: Synchronized Description, Tasting Notes, Heat & Actions */}
                <div className="lg:col-span-6 flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProduct.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {/* Category & Commercial Target */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[#6B1713] font-bold uppercase tracking-wider font-montserrat">
                          {activeProduct.category}
                        </span>
                        <span className="text-[#35160E]/60 font-medium">
                          {activeProduct.commercialTarget}
                        </span>
                      </div>

                      {/* Name & Subtitle */}
                      <div>
                        <h3 className="font-montserrat text-2xl sm:text-3xl font-bold text-[#35160E] leading-snug">
                          {activeProduct.name}
                        </h3>
                        <p className="text-sm text-[#35160E]/75 italic mt-1">
                          &ldquo;{activeProduct.subtitle}&rdquo;
                        </p>
                      </div>

                      {/* Price & Heat Rating Box */}
                      <div className="flex flex-wrap items-center justify-between gap-4 py-3.5 px-4 bg-[#F4ECE0] rounded-2xl border border-[#E7DAC8]">
                        <div>
                          <span className="block text-[10px] text-[#35160E]/60 uppercase tracking-widest font-semibold">
                            {activeIsB2B ? t.catalog.commercial : t.catalog.standard}
                          </span>
                          <span className="text-2xl font-bold text-[#6B1713] tabular-nums font-montserrat">
                            {activePriceDisplay}
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
                                  i < activeProduct.heatIndex
                                    ? 'text-[#6B1713] fill-[#6B1713]'
                                    : 'text-[#E7DAC8]'
                                }`}
                              />
                            ))}
                            <span className="text-xs font-semibold text-[#35160E] ml-1">
                              {activeProduct.heatLabel}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Craft Milling Description */}
                      <p className="text-sm text-[#35160E]/90 leading-relaxed">
                        {activeProduct.description}
                      </p>

                      {/* Tasting Notes & Aroma */}
                      <div>
                        <span className="block text-xs uppercase tracking-wider font-semibold text-[#35160E]/70 mb-2 font-montserrat">
                          {t.hero.flavorNotes}
                        </span>
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {activeProduct.tastingNotes.map((note, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-[#F4ECE0] text-[#35160E] text-xs font-medium border border-[#E7DAC8]"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-[#35160E]/75 italic">
                          <strong>{t.catalog.aromaLabel}:</strong> {activeProduct.aromaProfile}
                        </p>
                      </div>

                      {/* Pairing & Provenance */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-[#F4ECE0]/60 border border-[#E7DAC8] text-xs text-[#35160E]/85">
                          <span className="font-bold text-[#35160E] block mb-0.5 font-montserrat">
                            {t.hero.pairing}
                          </span>
                          {activeProduct.pairingDish}
                        </div>
                        <div className="p-3 rounded-xl bg-[#F4ECE0]/60 border border-[#E7DAC8] text-xs text-[#35160E]/85 flex items-start gap-2">
                          <Compass className="w-4 h-4 text-[#2C5E3B] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#35160E] block mb-0.5 font-montserrat">
                              {t.hero.origin}
                            </span>
                            {activeProduct.origin}
                          </div>
                        </div>
                      </div>

                      {/* Purchase & Page Link Actions */}
                      <div className="pt-4 border-t border-[#E7DAC8] space-y-2.5">
                        <button
                          type="button"
                          onClick={(e) => handleDirectWhatsApp(activeProduct, e)}
                          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#6B1713] text-[#FAF4E8] font-bold text-sm shadow-md hover:bg-[#55120F] active:scale-[0.99] transition-all group"
                        >
                          <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          <span>
                            {activeIsB2B
                              ? t.productModal.requestQuote
                              : `${t.hero.instantBuy} (${activePriceDisplay})`}
                          </span>
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(activeProduct, e)}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#2C5E3B]/35 bg-white hover:bg-[#2C5E3B] hover:text-[#FAF4E8] hover:border-[#2C5E3B] text-[#2C5E3B] text-xs font-semibold transition-all"
                          >
                            {recentlyAddedId === activeProduct.id ? (
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

                          <Link
                            href={`/products/${activeProduct.slug}`}
                            className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#EBF2EC]/75 border border-[#2C5E3B]/30 hover:bg-[#2C5E3B] hover:text-[#FAF4E8] hover:border-[#2C5E3B] text-[#2C5E3B] text-xs font-semibold transition-all"
                          >
                            <span>{t.catalog.viewFullDetails}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Bottom Catalog Carousel Navigation Bar + Authentic Thumbnail Strip */}
            <div className="bg-[#FAF4E8]/90 rounded-2xl p-4 border border-[#E7DAC8] shadow-xs space-y-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrevProduct}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E7DAC8] bg-white hover:bg-[#EBF2EC]/70 hover:border-[#2C5E3B]/45 hover:text-[#2C5E3B] text-xs font-semibold text-[#35160E] transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{t.catalog.previousProduct}</span>
                </button>

                {/* Compact Dot Indicators */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md py-1 scrollbar-none">
                  {filteredProducts.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCarouselIndex(idx)}
                      aria-label={`Select ${p.name}`}
                      className={`h-2 rounded-full transition-all shrink-0 ${
                        safeIndex === idx
                          ? 'w-6 bg-[#6B1713]'
                          : 'w-2 bg-[#E7DAC8] hover:bg-[#2C5E3B]/55'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleNextProduct}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E7DAC8] bg-white hover:bg-[#EBF2EC]/70 hover:border-[#2C5E3B]/45 hover:text-[#2C5E3B] text-xs font-semibold text-[#35160E] transition-all active:scale-95"
                >
                  <span>{t.catalog.nextProduct}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Product Photo Thumbnail Track */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {filteredProducts.map((item, idx) => {
                  const localizedItem = getLocalizedProduct(item, language);
                  const isSelected = safeIndex === idx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCarouselIndex(idx)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#6B1713] text-[#FAF4E8] shadow-sm ring-2 ring-[#6B1713]/25'
                          : 'bg-[#F4ECE0] text-[#35160E]/80 border border-[#E7DAC8] hover:bg-[#EBF2EC]/70 hover:border-[#2C5E3B]/45 hover:text-[#2C5E3B]'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full overflow-hidden border border-white/50 shrink-0 block bg-[#EFE5D4]">
                        <img
                          src={item.dishImage || '/images/heritage_banner.jpg'}
                          alt={localizedItem.name}
                          referrerPolicy="no-referrer"
                          className={`w-full h-full object-cover ${
                            getProductImages(item)[0]?.backdrop === 'cutout'
                              ? 'mix-blend-multiply'
                              : ''
                          }`}
                        />
                      </span>
                      <span>{localizedItem.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* MODE 2: Floating Plate Grid with Per-Product Platter Photo Carousel */
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-28 gap-x-8 pt-24 sm:pt-28"
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={handleAddToCart}
                  onDirectWhatsApp={handleDirectWhatsApp}
                  isRecentlyAdded={recentlyAddedId === product.id}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Connected Media & Kitchen Discovery Bar */}
        <div className="mt-14 p-5 sm:p-6 rounded-3xl bg-[#FAF4E8] border border-[#E7DAC8] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#2C5E3B] font-montserrat block">
              {t.media.kicker}
            </span>
            <p className="text-sm sm:text-base font-bold text-[#35160E] font-montserrat mt-0.5">
              {t.media.reelsHeading} · {t.media.recipesHeading}
            </p>
          </div>
          <Link
            href="/media"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2C5E3B] hover:bg-[#21482D] text-[#FAF4E8] text-xs font-bold font-montserrat shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <span>{t.nav.media}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
