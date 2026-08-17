# Global Page Refactoring Plan

**Branch:** `dev` (no production impact)  
**Status:** 🔄 In Progress  
**Target:** B2B SaaS positioning (Curators + Advisors)

---

## 📋 Sections to Implement

### 1. HERO (MODIFY EXISTING)
**File:** Modify `PortalHero` call in `GlobalPage.jsx`

**Current:**
```
"Premium African Art for International Collectors"
```

**New:**
```
Title: "Professional Infrastructure for African Art"
Subtitle: "The only SaaS platform connecting curators, advisors, 
           and institutions to trade and scale African art globally."
CTAs: 
  - "Explore Platform" → /global/catalogue (for curators)
  - "Request Demo" → (contact form)
```

---

### 2. FOR CURATORS (NEW SECTION)
**File:** Create `src/components/landing/global/GlobalCuratorsSection.jsx`

**Content:**
- Heading: "Curate. Certify. Scale."
- Features (icons + descriptions):
  - Inventory Management Dashboard
  - Digital Certification & Provenance
  - Logistics & Insurance Integration
  - Real-time Valuation & Analytics
  - Multi-entity Governance

- Interactive: "See how certification works →" [Live demo button]

**Component:**
- Card layout (2-3 features per row)
- Icons: (TBD — lucide-react)
- Interactive demo link (modal or new page)

---

### 3. FOR ADVISORS (NEW SECTION)
**File:** Create `src/components/landing/global/GlobalAdvisorsSection.jsx`

**Content:**
- Heading: "Invest. Advise. Build Portfolio."
- Features (icons + descriptions):
  - Client Portfolio Management
  - Curated Deal Flow & Sourcing
  - Market Intelligence Dashboard
  - Secure Transaction Management
  - Commission Tracking

- Interactive: "Explore deal flow →" [Sample deals button]

**Component:**
- Similar card layout to Curators section
- Icons: (TBD)
- Interactive element links to sample deals

---

### 4. TRY THE PLATFORM (REPOSITION EXISTING)
**File:** Create wrapper `src/components/landing/global/GlobalTryPlatformSection.jsx`

**Reposition:**
- Existing `LogisticsSimulatorSection` → becomes "Interactive: Logistics Simulator"
- Existing `GlobalLogisticsSection` → "Calculate Export Costs" (curator tool)
- Existing insurance tools → "Cover Your Artworks" (both roles)

**New heading:** "Experience Infrastructure in Action"  
**Subheading:** "See how curators and advisors use KUCIBOK daily"

**Layout:**
```
TRY THE PLATFORM
├─ Logistics Simulator
│  └─ "Calculate export costs" 
├─ Insurance Calculator
│  └─ "Cover your artworks"
└─ Certification Flow
   └─ "Track provenance"
```

**Key:** These are DEMOS of the SaaS, not standalone features

---

### 5. PRICING (UPDATE EXISTING)
**File:** Update `src/components/landing/global/GlobalPricingSection.jsx`

**Changes:**
- Rename plans: "Curator Plan" & "Advisor Plan"
- Add pricing tiers:
  - Curator: €21-49/month
  - Advisor: €49-99/month
  - Enterprise: Custom
- CTA: "Start Free Trial"

**Keep existing:** Visual design, color scheme

---

### 6. TRUST SIGNALS (UPDATE EXISTING)
**File:** Create/update `src/components/landing/global/GlobalTrustSection.jsx`

**Content:**
```
✅ Used by X curators (update with real numbers)
✅ €X managed on platform
✅ X countries covered
✅ Enterprise-grade security
```

**Optional:** Add testimonials from professional users (curators/advisors, not artists)

---

### 7. CTA & ENTERPRISE (NEW)
**File:** Update `GlobalCtaSection.jsx`

**Content:**
```
Heading: "Ready to Scale Your Art Business?"
CTA 1: "Start Free Trial" (main CTA)
CTA 2: "Request Enterprise Demo" (for large institutions)
```

---

## 🔄 Implementation Order

1. **Modify Hero** (GlobalPage.jsx + i18n updates)
2. **Create GlobalCuratorsSection.jsx**
3. **Create GlobalAdvisorsSection.jsx**
4. **Reposition LogisticsSimulator** (create GlobalTryPlatformSection.jsx)
5. **Update Pricing** (GlobalPricingSection.jsx)
6. **Update Trust Signals** (GlobalTrustSection.jsx)
7. **Update CTA** (GlobalCtaSection.jsx)
8. **Update GlobalPage.jsx** (reorder sections)
9. **Update i18n** (globalT translations)
10. **Update SEO/Helmet** (title, description)

---

## 📐 Design Guidelines

- **Keep existing:** Colors, typography, design system
- **Messaging:** "Professional SaaS" (not marketplace, not simulator)
- **Audience:** B2B (Curators, Advisors, Institutions)
- **Focus:** Infrastructure, not artworks
- **CTA:** Clear action (Free trial, Request demo, Explore)

---

## ✅ Validation Checklist

- [ ] Hero messaging updated
- [ ] For Curators section created
- [ ] For Advisors section created
- [ ] Try Platform section repositioned
- [ ] Pricing updated with B2B tiers
- [ ] Trust signals/testimonials added
- [ ] i18n translations updated
- [ ] SEO metadata updated
- [ ] All sections visible & responsive
- [ ] Links working (CTAs, demos, etc.)
- [ ] Tests passing (316/316)
- [ ] No console errors
- [ ] Mobile responsive (tested on devices)

---

## 📝 Files to Create/Modify

```
src/components/landing/global/
├─ PortalHero.jsx (MODIFY — Hero text/CTAs)
├─ GlobalCuratorsSection.jsx (NEW)
├─ GlobalAdvisorsSection.jsx (NEW)
├─ GlobalTryPlatformSection.jsx (NEW — reposition simulators)
├─ GlobalPricingSection.jsx (UPDATE — curator/advisor tiers)
├─ GlobalTrustSection.jsx (CREATE — signals/testimonials)
└─ GlobalCtaSection.jsx (UPDATE — enterprise CTA)

src/pages/
└─ GlobalPage.jsx (MODIFY — reorder sections)

src/i18n/
└─ global.js (UPDATE — new section translations)

src/
└─ (SEO Helmet tag updates)
```

---

## 🎯 Success Criteria

✅ Page clearly positions Kucibok as **B2B SaaS**  
✅ Curators understand **inventory + certification** benefits  
✅ Advisors understand **portfolio + deal flow** benefits  
✅ Pricing is **visible and clear** (B2B tiers)  
✅ CTAs drive to **free trial** or **demo request**  
✅ Design remains **consistent** with existing brand  
✅ No production impact (**dev branch only**)  

---

**Timeline:** TBD (depends on implementation speed)  
**Branch:** `dev` (safe to work)  
**Deployment:** After validation + code review
