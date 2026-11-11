'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { Flame, ShoppingBag, Send, Check } from 'lucide-react';
import { CATALOG, ProductSKU } from '@/data/catalog';
import { getLocalizedProduct } from '@/data/catalogI18n';
import { useCart } from '@/lib/cartStore';
import { useLanguage } from '@/lib/i18n';
import { buildSingleItemOrderUrl } from '@/lib/whatsapp';

type CategoryFilter = 'All' | 'Signature Blends' | 'Pure Powders' | 'Bulk & Export';

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
  const { t, language } = useLanguage();
  const localized = getLocalizedProduct(product, language);
  const isB2B = product.category === 'Bulk & Export';

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

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelectProduct && onSelectProduct(localized)}
      className="group relative bg-[#FAF4E8] rounded-3xl p-5 sm:p-6 pt-20 border border-[#E7DAC8] shadow-[0_10px_30px_-10px_rgba(53,22,14,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(53,22,14,0.16)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Floating Parallax Platter */}
      <motion.div
        style={{
          y: smoothY,
          rotate: smoothRotate,
        }}
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full p-1.5 bg-[#FAF4E8] border-2 border-[#E7DAC8] shadow-[0_20px_40px_-10px_rgba(53,22,14,0.32)] group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 z-10 will-change-transform"
      >
        <div className="w-full h-full rounded-full overflow-hidden relative shadow-inner">
          <motion.div
            style={{
              scale: smoothScale,
              y: smoothImageY,
            }}
            className="w-full h-full relative will-change-transform"
          >
            <img
              src={localized.dishImage || '/images/heritage_banner.jpg'}
              alt={localized.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />
          </motion.div>
        </div>
      </motion.div>

      {/* Card Content Top */}
      <div>
        {/* Packaging & Category Line */}
        <div className="flex items-center justify-between text-[11px] text-[#35160E]/60 mb-2">
          <span className="font-semibold text-[#6B1713] uppercase tracking-wider font-cinzel">
            {localized.category}
          </span>
          <span>{localized.packaging}</span>
        </div>

        {/* Title */}
        <h3 className="font-cinzel text-lg font-bold text-[#35160E] group-hover:text-[#6B1713] transition-colors leading-snug">
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
          <span className="text-base sm:text-lg font-bold text-[#35160E] tabular-nums font-cinzel block truncate">
            {localized.priceDisplay}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={(e) => onAddToCart(localized, e)}
            className="p-2 sm:p-2.5 rounded-xl border border-[#E7DAC8] bg-[#FAF4E8] hover:bg-[#F4ECE0] text-[#35160E] transition-all shrink-0"
            title="Add to order bag"
          >
            {isRecentlyAdded ? (
              <Check className="w-4 h-4 text-emerald-700" />
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
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const { addItem, openSimulator } = useCart();
  const { t, language } = useLanguage();

  const filteredProducts =
    activeCategory === 'All'
      ? CATALOG
      : CATALOG.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: ProductSKU, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 2000);
  };

  const handleDirectWhatsApp = (product: ProductSKU, e: React.MouseEvent) => {
    e.stopPropagation();
    const orderData = buildSingleItemOrderUrl(product, 1, language);
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
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs uppercase tracking-widest text-[#6B1713] font-bold font-cinzel block mb-2">
            {t.catalog.tagline}
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#35160E] tracking-tight">
            {t.catalog.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#35160E]/75 leading-relaxed">
            {t.catalog.description}
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 mt-8 bg-[#FAF4E8] rounded-2xl border border-[#E7DAC8] shadow-sm max-w-full overflow-x-auto scrollbar-none">
            {categoryTabLabels.map((tab) => {
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`relative px-3 sm:px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors z-10 ${
                    isActive ? 'text-[#FAF4E8]' : 'text-[#35160E]/75 hover:text-[#35160E]'
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
        </div>

        {/* Floating Plate Grid with generous pt-24 spacing so -top-16 platters never collide */}
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
      </div>
    </section>
  );
}
