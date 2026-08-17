# Global Page Refactor — Complete Preview

**Branch:** `dev`  
**Status:** Phases 1-2 Complete  
**Tests:** 316/316 ✅

---

## 🎨 Page Structure (Top to Bottom)

### SECTION 1: HERO
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Professional Infrastructure for African Art at Scale      │
│                                                             │
│   The only SaaS platform connecting curators, advisors,     │
│   and institutions to trade and scale African art globally. │
│   Complete infrastructure — from certification to logistics │
│   to transactions.                                          │
│                                                             │
│   [Explore Platform]  [Request Demo]                       │
│                                                             │
│                   [Hero Showcase - Artwork]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Changes from Original:**
- ✅ New title: "Professional Infrastructure..." (was "The Standard for African Art Circulation")
- ✅ New subtitle: Focus on SaaS, curators, advisors, institutions
- ✅ New CTAs: "Explore Platform" + "Request Demo" (was "Browse Catalogue" + "Request Sourcing")
- ✅ Messaging: Infrastructure-first, not marketplace

---

### SECTION 2: FOR CURATORS (NEW)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                  Curate. Certify. Scale.                   │
│   Professional tools for curators managing African art      │
│              operations globally                           │
│                                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│   │ Package  │  │ FileText │  │  Truck   │               │
│   │ Inventory│  │Certifctn │  │Logistics │               │
│   │Management│  │ Provnance│  │Insurance │               │
│   └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│   ┌──────────┐  ┌──────────┐                             │
│   │ TrendUp  │  │  Users   │                             │
│   │Valuation │  │Governance│                             │
│   │Analytics │  │Multi-ent │                             │
│   └──────────┘  └──────────┘                             │
│                                                             │
│    See how certification works →  [Interactive Demo]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**NEW SECTION**
- 5 feature cards with icons (lucide-react)
- Interactive element: "See how certification works" → Modal/Demo
- Design: Dark background, silver accents, hover effects
- Bilingual: EN + FR

---

### SECTION 3: FOR ADVISORS (NEW)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           Invest. Advise. Build Portfolio.                │
│    Professional tools for advisors scaling their business   │
│                                                             │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│   │ Briefcse │  │ TrendUp  │  │ BarChart │               │
│   │ Portfolio│  │ Deal Flow│  │Inteligen.│               │
│   │Management│  │ Sourcing │  │Dashboard │               │
│   └──────────┘  └──────────┘  └──────────┘               │
│                                                             │
│   ┌──────────┐  ┌──────────┐                             │
│   │  Lock    │  │ Percent  │                             │
│   │Transactions│  │Commission│                             │
│   │Secure    │  │ Tracking │                             │
│   └──────────┘  └──────────┘                             │
│                                                             │
│     Explore deal flow →  [Sample Deals]                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**NEW SECTION**
- 5 feature cards (same design as Curators)
- Interactive element: "Explore deal flow" → Sample deals page
- Mirrors Curators layout for consistency
- Bilingual: EN + FR

---

### SECTION 4: PILLARS (EXISTING, KEPT)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  01 KCB Certification | 02 Door-to-Door Logistics         │
│  03 B2B Sourcing                                          │
│                                                             │
│  [Descriptions...]                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Unchanged:** Original pillar section retained

---

### SECTION 5: TRY THE PLATFORM (REPOSITIONED)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Global Logistics Network (Logistics Section)          │
│     Africa to the World — Every Continent, One Standard   │
│                                                             │
│  [Collection] → [Packing] → [Customs] → [Delivery]       │
│                                                             │
│  Logistics Simulator & Calculator                         │
│  (Interactive tools from existing LogisticsSimulatorSection)│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Repositioned:** Logistics simulator now positioned as "Try Platform" demo

---

### SECTION 6: PRICING (UPDATED) ⭐ KEY CHANGE
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│        Professional Pricing                               │
│        Plans Built for Professionals                      │
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────┐ │
│  │ CURATOR PLAN    │ │ ADVISOR PLAN    │ │ ENTERPRISE  │ │
│  │ €21-49/month    │ │ €49-99/month    │ │ Custom      │ │
│  │                 │ │                 │ │ pricing     │ │
│  │ ✓ Inventory     │ │ ✓ Portfolio     │ │ ✓ Everything│ │
│  │ ✓ Certification │ │ ✓ Deal Flow     │ │ ✓ Multi-ent │ │
│  │ ✓ Logistics     │ │ ✓ Intelligence  │ │ ✓ API       │ │
│  │ ✓ Valuation     │ │ ✓ Transactions  │ │ ✓ Dedicated │ │
│  │ ✓ Support       │ │ ✓ Commissions   │ │ ✓ Custom    │ │
│  │                 │ │                 │ │             │ │
│  │[Start Free Trip]│ │[Start Free Trip]│ │[Request Demo]│
│  └─────────────────┘ └─────────────────┘ └─────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**MAJOR UPDATE** (from collector/curator/advisor/institutional → B2B tiers)
- ✅ Curator Plan: €21-49/month (small curators, galleries)
- ✅ Advisor Plan: €49-99/month (portfolio managers, advisors)
- ✅ Enterprise: Custom (institutions, large operations)
- ✅ CTAs: "Start Free Trial" (Curator/Advisor) + "Request Demo" (Enterprise)
- ✅ Clear feature differentiation per role

---

### SECTION 7: TRUST SIGNALS (TO DO - OPTIONAL)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ✓ Used by X curators globally                            │
│  ✓ €X managed on platform                                 │
│  ✓ X countries covered                                    │
│  ✓ Enterprise-grade security                              │
│                                                             │
│  [Optional: Testimonials from curators/advisors]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Status:** TO DO (Phase 3)

---

### SECTION 8: CTA & ENTERPRISE (EXISTING)
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│       Ready to Scale Your Art Business?                   │
│                                                             │
│   [Start Free Trial]  [Request Enterprise Demo]           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Slightly updated CTAs** from original

---

### SECTION 9: FOOTER (UNCHANGED)
```
Kucibok | Platform | Resources | Legal | Copyright
```

---

## 📊 **Key Changes Summary**

| Section | Before | After | Status |
|---------|--------|-------|--------|
| **Hero** | Marketplace tagline | B2B SaaS positioning | ✅ Done |
| **For Curators** | N/A (new) | 5 features | ✅ Done |
| **For Advisors** | N/A (new) | 5 features | ✅ Done |
| **Pillars** | Original | Same | ✅ Kept |
| **Try Platform** | Existing simulators | Repositioned demos | ✅ Done |
| **Pricing** | 4 generic tiers | 3 B2B tiers | ✅ Done |
| **Trust Signals** | Existing | Unchanged | ⏳ Optional |
| **CTA** | Existing | Slightly updated | ⏳ Phase 4 |

---

## 🎯 **Messaging Transformation**

### BEFORE (Marketplace)
```
"The Standard for African Art Circulation"
"Access curated catalogue of certified art"
"CTAs: Browse Catalogue, Request Sourcing"
Focus: Individual collectors, artworks
```

### AFTER (B2B SaaS) ✅
```
"Professional Infrastructure for African Art at Scale"
"Only SaaS platform connecting curators, advisors, institutions"
"CTAs: Explore Platform, Request Demo"
Focus: Professional roles, business outcomes
```

---

## 💡 **Visual Design Notes**

- ✅ **Colors:** Keep existing (kcb-noir-deep, kcb-silver, kcb-or)
- ✅ **Typography:** Existing (playfair headings, dm-sans body)
- ✅ **Components:** Reuse existing card patterns, hover effects
- ✅ **Icons:** lucide-react (Package, FileText, Truck, TrendUp, Users, Briefcase, BarChart3, Lock, Percent)
- ✅ **Spacing:** Consistent with existing sections (py-20 lg:py-32)
- ✅ **Responsive:** Mobile-first (grid-cols-1 md:grid-cols-2 lg:grid-cols-5)

---

## ✅ **Validation Checklist**

- [x] Hero messaging updated for B2B
- [x] Curators section created with 5 features
- [x] Advisors section created with 5 features
- [x] Pricing tiers updated to B2B (Curator/Advisor/Enterprise)
- [x] French translations added for all new content
- [x] All 316 tests passing
- [x] No production impact (dev branch only)
- [ ] Trust signals section (optional, Phase 3)
- [ ] SEO metadata updated (Phase 4)
- [ ] Mobile responsive testing (Phase 4)

---

## 🚀 **Ready for Next Steps**

**Current Status:**
- ✅ 2 phases complete
- ✅ 316 tests passing
- ✅ B2B positioning live in dev
- ✅ Bilingual (EN + FR)

**Next Options:**
1. **Phase 3:** Add Trust Signals section (quick, 1 hour)
2. **Phase 4:** SEO & final polish (30 min)
3. **Deploy:** Merge dev → main (when ready)
4. **Review:** Let me know what needs adjustment

---

**Branch:** `dev` | **Commits:** 2 (Curators/Advisors + Hero/Pricing) | **Tests:** 316/316 ✅
