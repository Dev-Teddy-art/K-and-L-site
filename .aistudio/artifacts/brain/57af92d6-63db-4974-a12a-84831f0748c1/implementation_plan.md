# K&L Spices E-Commerce Platform

Artisanal West African heritage spice storefront featuring an interactive kinetic culinary tasting stage, floating product catalog, and zero-friction WhatsApp direct order conversion engine.

***

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been aligned based on your feedback and the PRD:
>
> - **Primary Development Focus**: Priority spotlight on the **Kinetic Hero Stage & Interactive Tasting Studio** (inertial rotating platter, orbital halo, real-time tasting notes, heat meters) with seamless integration to the catalog and cart drawer.
> - **Visual Direction**: Rich, artisanal culinary food and spice photography with warm parchment surfaces (`#FAF4E8`), deep burgundy accents (`#6B1713`), and earthy typography.
> - **WhatsApp Conversion Pipeline**: Configured with the official desk phone `+234 810 483 5175`, supplemented with an **in-app WhatsApp Message Simulator** and 1-click clipboard copier for frictionless testing.

***

## 1. Overview & Core Concept

**K&L Spices** is a premium West African culinary purveyor offering small-batch, stone-milled native seasonings, single-origin peppers, and raw export commodities. 

Rather than relying on standard e-commerce carts with multi-step payment gateway drop-offs, K&L Spices connects high-fashion editorial art direction with an instant **WhatsApp direct-to-order pipeline**.

### Target Audiences & Commercial Tiers
1. **D2C Retail Foodies**: Home cooks seeking authentic stone-milled Jollof mixes, Suya peppers, and restorative pepper soup spices in 100g glass jars.
2. **HORECA Buyers**: Restaurants and caterers ordering high-volume rubs, pure garlic/onion powders, and heritage broth seasonings.
3. **Commodity Exporters**: Commercial processors sourcing bulk ginger slices, black/white pepper seeds, and turmeric roots.

***

## 2. User Experience & Visual Design

### Design System & Visual Tokens
Grounded in an authentic culinary palette—purging synthetic neons and artificial gold in favor of rich wine, deep earth, and natural parchment:

| Token Name | Value | Usage |
| :--- | :--- | :--- |
| **Brand Burgundy** | `#6B1713` | Top notification bar, hero CTAs, active filter indicators, badges |
| **Deep Earth Dark** | `#35160E` | Primary headings, brand brushwork typography, card details |
| **Warm Parchment** | `#FAF4E8` | Global page background canvas, input wells, card interiors |
| **Warm Sand Accent** | `#F4ECE0` | Catalog section contrast background, subtle card borders |
| **Delicate Border** | `#E7DAC8` | Hairline dividers, card outlines, table borders |

### Typography Pairing
- **Display Headings**: `Cinzel` serif via Google Fonts for artisanal elegance and timeless luxury.
- **Body & Interface**: `Plus Jakarta Sans` for clean, high-legibility specs, price tags, and culinary descriptions.
- **Tabular Figures**: `tabular-nums` for consistent currency and weight alignments.

### Kinetic Hero Stage (`LuxuryHero.tsx`)
- **Inertial Spring Platter**: Central culinary plate showcasing hero spices that rotates dynamically with spring physics (`stiffness: 120`, `damping: 20`) upon selecting different spices.
- **Orbital Dashed Halo**: Continuous, subtle 80-second rotational ring surrounding the platter to establish depth and motion.
- **Synchronized Flavor Studio**: Live updates to the headline, tasting notes, heat rating indicator (🌶️ 1 to 5), origin provenance, and single-click direct order CTA.
- **Interactive Spice Carousel**: Thumbnail controls allowing instant switching between featured hero blends (Jollof Rice Spice, Yaji Suya Pepper, Nigerian Native Soup Spice, Pepper Soup Spice).

### Floating Plate Catalog (`AnimatedCatalog.tsx`)
- **Overhanging Platter Layout**: Circular product platters hung with a negative top margin (`-top-16`) casting authentic soft drop shadows onto cards.
- **Category Filter Tabs**: Smooth Framer Motion spring physics transitioning between *All*, *Signature Blends*, *Pure Powders*, and *Bulk & Export*.
- **Card Micro-Interactions**: Hovering lifts the plate by 10% with subtle zoom, quick-add action, and detail view trigger.

### Slide-Over Cart Drawer & WhatsApp Simulator (`CartDrawer.tsx`)
- **Cart Management**: Persistent local shopping bag with quantity increment/decrement, free delivery indicator, and line-item totals in Nigerian Naira (₦).
- **Direct WhatsApp Dispatch**: Compiles an exact pre-formatted, URI-encoded WhatsApp message to `+234 810 483 5175`.
- **In-App Message Simulator**: Modal previewing the exact formatted message with phone copy and launch options for desktop or testing without leaving the site.

***

## 3. Product Catalog & Inventory Data

13 verified stock keeping units across 3 commercial tiers:

```
┌────────────────────────────────┬─────────────────┬────────────────────┬──────────┬──────────────┐
│ SKU Name                       │ Packaging       │ Category           │ Price    │ Heat Index   │
├────────────────────────────────┼─────────────────┼────────────────────┼──────────┼──────────────┤
│ Jollof Rice Spice Mix          │ 100g Glass Jar  │ Signature Blends   │ ₦3,500   │ 🌶️🌶️ (2/5)     │
│ Nigerian Native Soup Spice     │ 100g Glass Jar  │ Signature Blends   │ ₦3,500   │ 🌶️🌶️🌶️ (3/5)   │
│ Yaji Suya Pepper               │ 100g Glass Jar  │ Signature Blends   │ ₦3,000   │ 🌶️🌶️🌶️🌶️ (4/5) │
│ Pepper Soup Spice Mix          │ 100g Glass Jar  │ Signature Blends   │ ₦3,000   │ 🌶️🌶️🌶️🌶️ (4/5) │
│ Dried Yellow Habanero Pepper   │ 100g Glass Jar  │ Signature Blends   │ ₦3,200   │ 🌶️🌶️🌶️🌶️🌶️ (5/5)│
│ Turmeric Root Powder           │ 100g Foil Pouch │ Pure Powders       │ ₦2,500   │ Mild (0/5)   │
│ White Onion Powder             │ 100g Foil Pouch │ Pure Powders       │ ₦2,500   │ Savory (0/5) │
│ Chilli Pepper Powder           │ 100g Foil Pouch │ Pure Powders       │ ₦2,500   │ 🌶️🌶️🌶️🌶️ (4/5) │
│ Garlic Powder                  │ 100g Foil Pouch │ Pure Powders       │ ₦2,500   │ Pungent (0/5)│
│ Dried Ginger Slices            │ Bulk Sack (Kg)  │ Bulk & Export      │ B2B Quote│ Warm (2/5)   │
│ White Pepper Seeds             │ Bulk Sack (Kg)  │ Bulk & Export      │ B2B Quote│ Sharp (3/5)  │
│ Black Pepper Seeds             │ Bulk Sack (Kg)  │ Bulk & Export      │ B2B Quote│ Bold (3/5)   │
│ Whole Turmeric Roots           │ Bulk Sack (Kg)  │ Bulk & Export      │ B2B Quote│ Earth (0/5)  │
└────────────────────────────────┴─────────────────┴────────────────────┴──────────┴──────────────┘
```

***

## 4. Technical Architecture & Component Tree

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             RootLayout (Server)                             │
│   • Google Fonts: Cinzel & Plus Jakarta Sans                                │
│   • JSON-LD ItemList Schema (Applet SEO)                                    │
│   • Top Notification Ribbon ("Artisanal Heritage Spices • Direct Dispatch") │
│   • Top Navigation Bar (Wordmark, Nav Anchors, Cart Trigger with Counter)  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
     ┌─────────────────────────────────┼────────────────────────────────┐
     ▼                                 ▼                                ▼
┌──────────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────────┐
│       LuxuryHero         │  │      AnimatedCatalog      │  │        BrandStory         │
│     (Client Island)      │  │      (Client Island)      │  │     (Culinary Heritage)   │
│ • Kinetic Spring Platter │  │ • Category Filter Bar     │  │ • Heritage Milling Method │
│ • Orbital Dashed Halo    │  │ • 13 Product Floating     │  │ • Single-Origin Sourcing  │
│ • Tasting Notes Sync     │  │   Plate Cards             │  │ • Export & Wholesale Info │
│ • Heat Index Meter       │  │ • Quick Add & WhatsApp CTAs│ └───────────────────────────┘
│ • Quick WhatsApp Buy     │  └─────────────┬─────────────┘
└────────────┬─────────────┘                │
             │                              │
             └──────────────────────┬───────┘
                                    │
                                    ▼
                     ┌─────────────────────────────┐
                     │     CartDrawer & Engine     │
                     │  • Reactive Item Storage    │
                     │  • Quantity Incrementors    │
                     │  • WhatsApp URL Compiler    │
                     │  • In-App Message Simulator │
                     └─────────────────────────────┘
```

### Key Integrations & Implementation Steps

1. **Brand Assets & Photography Generation**:
   - Curate high-resolution culinary assets for the signature spice dishes and platters using `generate_image` (Jollof rice platter, grilled Suya platter, native soup presentation, and spice jars).
2. **Typography & Styling Configuration**:
   - Integrate Cinzel and Plus Jakarta Sans into `app/layout.tsx`.
   - Configure Tailwind design tokens (`#6B1713`, `#FAF4E8`, `#35160E`, `#F4ECE0`, `#E7DAC8`).
3. **Data Model (`data/catalog.ts`)**:
   - Strongly-typed inventory model with 13 products, tasting notes, pairing ideas, heat levels, and prices.
4. **Interactive Hero & Tasting Stage (`components/LuxuryHero.tsx`)**:
   - Kinetic platter with Framer Motion spring physics, orbital backdrop halo, synchronized aroma & flavor badges, and single-item instant order dispatch.
5. **Floating Plate Catalog (`components/AnimatedCatalog.tsx`)**:
   - Category filtering with spring layout animations, floating product cards, and quick add-to-cart.
6. **Cart Drawer & WhatsApp Direct Engine (`components/CartDrawer.tsx` & `lib/whatsapp.ts`)**:
   - Slide-over drawer with item counters, subtotal math, and pre-formatted URI-encoded WhatsApp links for single and multi-item orders with the in-app message simulator.
7. **SEO & Structured Data**:
   - Full Schema.org `ItemList` and `Product` JSON-LD injected in RootLayout.
