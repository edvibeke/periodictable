# Edvibe Periodic Table — Master TODO

## 0) Project Snapshot
- [x] Baseline fixes applied: `script.js` corruption/logic repaired, duplicate inline script removed, basic HTML/CSS structural issues fixed.
- [x] Stack: static `index.html`, `styles.css`, `script.js`, jQuery 3.6, Inter, no build step.
- [ ] Goal: transform into a premium, interactive, Edvibe-branded periodic table with animations and Trends Lab.

## 1) Vision & Success Criteria
- [ ] **Vision**: best-in-class periodic table for students — beautiful, fast, educational, interactive, trustworthy; brought by Edvibe.
- [ ] **v1 Success criteria**
  - [ ] All 118 elements render correctly in standard periodic layout.
  - [ ] Element click/tap opens animated glass detail view with accurate key properties.
  - [ ] Filters, search, and trends work on desktop and mobile.
  - [ ] Trends Lab visually shows >=3 periodic trends across periods/groups (not text-only).
  - [ ] Edvibe links/CTAs present and correct.
  - [ ] Keyboard flow, visible focus, reduced-motion support, no console errors.
  - [ ] Smooth animations, no major layout jank.

## 2) Decisions (default unless changed)
- [ ] Brand: Edvibe-inspired palette/assets, not strict clone. Confirm logo usage.
- [ ] Trend v1: `Atomic Radius`, `Electronegativity`, `First Ionization Energy`.
- [ ] Data: vetted public data; `N/A` for unknown; attribution in README/footer.
- [ ] Dependencies: no new runtime deps; vanilla JS + existing jQuery.
- [ ] Detail view: glass modal desktop, near-full-screen on mobile.

## 3) Design System
- [ ] **Tokens**
  - [ ] BG: deep navy (`#070b14` base), elevated/glass layers.
  - [ ] Brand: cyan primary (`#00d4ff`), blue support, restrained accent.
  - [ ] Text: primary/muted/dim with AA contrast.
  - [ ] Category colors: cohesive, readable, legend-aligned.
  - [ ] Trend scales: accessible heatmap gradient + `N/A` pattern.
- [ ] **Glassmorphism**
  - [ ] Use on nav/control deck, modal, trend cards, legend/tooltips.
  - [ ] `backdrop-filter` + border + soft shadow; solid fallback.
  - [ ] Avoid heavy blur on every tile for performance.
- [ ] **Typography/spacing**
  - [ ] Inter scale; clear tile symbol/number/name hierarchy.
  - [ ] Spacing/radius/shadow tokens; consistent component styling.
- [ ] **Components**
  - [ ] Buttons/chips: default/hover/active/focus-visible/disabled.
  - [ ] Modal: backdrop, animated container, close, content grid.
  - [ ] Tooltip: trend value + unit.
  - [ ] Legend: categories + trend gradient.

## 4) IA & Layout
- [ ] **Structure**
  - [ ] Header/nav: Edvibe wordmark, title, feature links.
  - [ ] Hero: student-focused headline, subtext, CTAs.
  - [ ] Control deck: filters, search, view toggle, reset, legend.
  - [ ] Table: 18-column grid, lanthanide/actinide rows.
  - [ ] Detail modal/sheet: element properties + Edvibe CTA.
  - [ ] Trends Lab: interactive explorer below table.
  - [ ] Learn-more cards: Notes, Quizzes, Flashcards, Simulations.
  - [ ] Footer: Edvibe links, contact/about, copyright, attribution.
- [ ] **Edvibe links** (`target="_blank" rel="noopener noreferrer"`)
  - [ ] https://edvibe.co.ke/
  - [ ] https://edvibe.co.ke/about.php
  - [ ] https://edvibe.co.ke/notes.php
  - [ ] https://edvibe.co.ke/notes.php?subject=chemistry
  - [ ] https://edvibe.co.ke/quizzes.php
  - [ ] https://edvibe.co.ke/flashcards.php
  - [ ] https://edvibe.co.ke/simulations.php
  - [ ] https://edvibe.co.ke/contact.php
- [ ] **Responsive**
  - [ ] Desktop full grid; tablet/mobile horizontal scroll + compact tiles.
  - [ ] Modal usable at 360px; tap targets >= ~44px.

## 5) Periodic Table UX
- [ ] Standard layout, 118 elements, correct lanthanide/actinide placement.
- [ ] Tile: atomic number, symbol, name, mass (responsive).
- [ ] Hover/focus lift + glow; selected state distinct.
- [ ] Filters: All/Metals/Metalloids/Nonmetals/States/Groups/Periods + subfilters.
- [ ] Search by name/symbol/atomic number; result count / empty state.
- [ ] Reset restores default view.
- [ ] Detail modal: animated open from element, ESC/close/backdrop close, focus trap/restore.
- [ ] Detail fields: symbol, name, number, mass, category, phase, group, period, block, config, oxidation states, trend values, summary/fact, Edvibe CTA.

## 6) Animation & Motion
- [ ] Principles: purposeful, short, smooth; transform/opacity; `prefers-reduced-motion`.
- [ ] Initial load: staggered tile fade/scale-in.
- [ ] Filter/search: graceful dim/hide/show transitions.
- [ ] Element press: micro feedback.
- [ ] Modal: source-rect open/close + backdrop fade.
- [ ] Trend switch: heatmap/color/value transitions.
- [ ] Trend play: animated period/group sweep with highlight/tooltip.

## 7) Trends Lab
- [ ] **Data**
  - [ ] Canonical element dataset (`ELEMENT_DATA` or `elements.json`).
  - [ ] Fields: atomicNumber, symbol, name, mass, group, period, block, category, phase, config, oxidationStates, electronegativityPauling, atomicRadiusPm, ionizationEnergyKJMol, electronAffinityKJMol (optional), summary.
  - [ ] `null` for unknown; render `N/A`; include units.
- [ ] **v1 Trends**
  - [ ] Atomic Radius (pm) — decreases across period, increases down group.
  - [ ] Electronegativity (Pauling) — increases across period, decreases down group; noble gas N/A.
  - [ ] First Ionization Energy (kJ/mol) — general increase across period, decrease down group.
- [ ] **UI**
  - [ ] Trend selector, mode (`Across Period`/`Down Group`/`Heatmap`), period/group selector.
  - [ ] Play/Pause/Step walkthrough.
  - [ ] Legend: min/max, unit, color scale, N/A.
  - [ ] Plain-language explanation card: what trend means + why.
- [ ] **Visualization**
  - [ ] Heatmap overlay on tiles; tooltip on hover/focus with value+unit.
  - [ ] N/A dim/hatch; no fake data.
  - [ ] Category identity remains accessible.

## 8) JavaScript Architecture
- [ ] Modularize: state, data, render, filters/search, modal, trends, animations, a11y.
- [ ] Remove dead selectors/duplicate bindings.
- [ ] Guard missing DOM nodes; no console errors.
- [ ] Progressive enhancement where possible.

## 9) Accessibility
- [ ] Landmarks, semantic controls, ARIA for modal/filters/tabs/live regions.
- [ ] Full keyboard support; Enter/Space on tiles; visible `:focus-visible`.
- [ ] Focus trap/restore for modal.
- [ ] Contrast AA; not color-only; reduced-motion.

## 10) Performance & QA
- [ ] Transform/opacity animations; minimize reflow.
- [ ] Lazy-load non-critical assets; optimize images.
- [ ] Cross-browser: Chrome/Edge/Firefox/Safari + mobile.
- [ ] `backdrop-filter` fallback; modal scroll lock/touch.
- [ ] Verify 118 elements, trend values/units, links, no duplicate IDs.

## 11) File Map
- [ ] `index.html` — semantic redesign, Edvibe branding/links, trends lab, modal ARIA, data hooks.
- [ ] `styles.css` — tokens, glass components, animations, responsive, trend legend, reduced-motion.
- [ ] `script.js` — state/data-driven UI, modal, search, trends, animations, a11y.
- [ ] `elements-data.js` or inline data — canonical element+trend data.
- [ ] `README.md` — features, attribution, Edvibe credit.
- [ ] `TODO.md` — track progress.

## 12) Milestones
- [ ] **M1 Design Foundation**: tokens, hero/nav/footer, Edvibe branding, responsive shell.
- [ ] **M2 Table Experience**: polished grid, filters/search, glass control deck, animations.
- [ ] **M3 Detail Experience**: animated modal, rich data, a11y.
- [ ] **M4 Trends Lab**: data model, 3 trends, heatmap, walkthrough, explanations.
- [ ] **M5 QA & Polish**: data verification, a11y/perf/cross-browser, final copy.

## 13) Definition of Done
- [ ] Edvibe-aligned, modern, professional, interactive periodic table.
- [ ] Students can explore elements and visualize trends clearly.
- [ ] Animations enhance UX; accessibility/performance/data quality verified.
