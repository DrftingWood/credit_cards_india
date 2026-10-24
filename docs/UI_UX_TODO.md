# UI/UX To-Do List & Implementation Roadmap — Credit Cards India

> **Branch:** `verify/all-cards-2026-10`  
> **Status:** Queued for Implementation  
> **Scope:** 368 cards across 33 issuers  

---

## 🚨 Phase 1: Foundation & Polish (P0 — Immediate)

- [ ] **1.1 Character Encoding & Mojibake Cleanup**
  - [ ] Sanitize ~2,600 Windows-1252 character artifacts across `site/app` and `site/components`.
  - [ ] Standardize on valid UTF-8 Indian Rupee (`₹`), em-dash (`—`), en-dash (`–`), bullets (`•`), and arrows (`→`).
  - [ ] Fix corrupted strings in `site/app/page.tsx`, `site/app/layout.tsx`, and detail components.

- [ ] **1.2 Header & Brand Navigation Overhaul**
  - [ ] Add active route indicator (pill/underline) for current section.
  - [ ] Add live catalog badge count: `"368 Cards • Sourced from T&Cs"`.
  - [ ] Clean up responsive wrapping on tablets and mobile devices.

- [ ] **1.3 Mobile Navigation Drawer / Bottom Tab Bar**
  - [ ] Implement mobile-friendly bottom navigation bar (`Browse`, `Compare`, `Calculator`, `Recommend`).
  - [ ] Smooth slide-out drawer for secondary links (`About`, `Booking`, `GitHub`, theme toggle).

- [ ] **1.4 Global Command Palette (`Cmd + K` / `Ctrl + K`)**
  - [ ] Modal dialog accessible from anywhere on the site with keyboard shortcut.
  - [ ] Instant fuzzy search across all 368 cards, 33 issuers, and key categories.
  - [ ] Keyboard navigation (`↑`/`↓` and `Enter`) to jump directly to any card detail page.

---

## 🛍️ Phase 2: Catalogue & Discovery UX (`/browse`) (P1 — High)

- [ ] **2.1 Floating "+ Compare" Dock**
  - [ ] Add "+ Compare" button to every card tile in the catalogue.
  - [ ] Persistent floating bottom drawer showing selected cards (e.g. *[Infinia] [Atlas] [Magnus] — Compare 3 cards →*).
  - [ ] 1-click navigation to `/compare?cards=...` with selected cards pre-populated.

- [ ] **2.2 Catalogue Sorting Dropdown**
  - [ ] Sort by *Net Reward Yield (High to Low)*.
  - [ ] Sort by *Annual Fee (Lifetime Free first / Low to High / High to Low)*.
  - [ ] Sort by *Accelerated Reward Rate (High to Low)*.
  - [ ] Sort by *Card Name (A → Z)*.
  - [ ] Sort by *Verification Freshness / Recently Updated*.

- [ ] **2.3 Quick Filter Chips**
  - [ ] One-click filter pills above the grid:
    - `✨ Lifetime Free`
    - `✈️ Zero Forex Markup`
    - `🛋️ Free Lounge Access`
    - `⚡ UPI RuPay`
    - `💳 Metal Cards`
    - `🍔 Dining & Delivery`

- [ ] **2.4 View Switcher (Kiwi Grid vs. Data Table)**
  - [ ] Grid View: Rich Kiwi-style flattened visual cards.
  - [ ] Dense Spec Table View: Scannable columns (Card, Issuer, Joining/Annual Fee, Base Rate, Top Rate, Lounges, Apply).

---

## 💳 Phase 3: Card Detail Page Supercharge (`/card/[issuer]/[slug]`) (P1 — High)

- [ ] **3.1 Interactive Spend Earnings Simulator**
  - [ ] Interactive slider on the card detail hero: *"How much will I earn on this card?"*
  - [ ] Dynamic monthly spend adjustment calculating estimated gross rewards, fee deduction, and net annual benefit in real-time.

- [ ] **3.2 Milestone Rewards Stepper**
  - [ ] Horizontal milestone progress visualizer for milestone-heavy cards (Amex Plat Travel, Axis Atlas, Tata Neu, etc.).
  - [ ] Visual indicator showing reward voucher values unlocked at spend checkpoints (e.g. ₹1.5L, ₹3L, ₹4L, ₹7.5L).

- [ ] **3.3 Airport Lounge Network Checker**
  - [ ] Visual breakdown of domestic vs international lounge access limits.
  - [ ] Spend condition alert (e.g. *"Requires ₹10,000 spend in previous quarter"*).
  - [ ] Network badge tags (`Priority Pass`, `Dreamfolks`, `LoungeKey`, `Visa Infinite`, `Mastercard Lounge`).

- [ ] **3.4 Similar / Alternative Cards Carousel**
  - [ ] Smart recommendations at bottom of page for cards in the same tier or with overlapping reward categories.

---

## 🧮 Phase 4: Calculator & Portfolio Stacker (`/calculator`) (P2 — Medium)

- [ ] **4.1 "My Wallet" Mode (Existing vs. New Cards)**
  - [ ] Toggle to select cards the user already owns.
  - [ ] Treats existing card annual fees as sunk costs (₹0 incremental fee) and optimizes spend across them before suggesting new cards.

- [ ] **4.2 Granular Merchant Sliders**
  - [ ] Specific merchant inputs for top Indian apps: Swiggy, Zomato, Amazon, Flipkart, Blinkit, Zepto, BookMyShow, MakeMyTrip.

- [ ] **4.3 Shareable Scenario URLs**
  - [ ] Serialize user spend sliders into URL query parameters (`/calculator?dining=50000&travel=20000`).
  - [ ] "Copy Link" / "Share Scenario" button for easy sharing on forums and social media.

---

## ⚖️ Phase 5: Compare Matrix UX (`/compare`) (P2 — Medium)

- [ ] **5.1 Sticky Card Header Columns**
  - [ ] Pinned top row with card face artwork and card names when scrolling down long spec rows.

- [ ] **5.2 "Differences Only" Toggle**
  - [ ] Filter out identical attributes to immediately highlight differences between selected cards.

- [ ] **5.3 Category Winner Badges**
  - [ ] Auto-highlight the leading card per category (`👑 Lowest Forex`, `👑 Highest Dining Yield`, `👑 Best Lounge Allowance`).
