# Edvibe Interactive Periodic Table

A modern, interactive periodic table built for students — brought to you by [Edvibe](https://edvibe.co.ke/).

## Features
- **118 elements** in a standard periodic table layout (lanthanides/actinides included)
- **Glassmorphism UI** with Edvibe-inspired dark/cyan visual design
- **Interactive element details**: click/tap any element for an animated modal with key properties, electron config, oxidation states, and trend snapshot
- **Filters & search**: category, state, group, period filters + live search by name/symbol/atomic number
- **Trends Lab**: visualize `Electronegativity`, `Atomic Radius`, and `First Ionization Energy` as heatmaps across periods/groups or all elements, with play mode and plain-language explanations
- **Animations**: staggered tile entrance, hover/focus micro-interactions, modal transitions; respects `prefers-reduced-motion`
- **Responsive**: desktop grid with horizontal scroll support on smaller screens, mobile-friendly modal
- **Edvibe links**: quick access to Notes, Quizzes, Flashcards, Simulations, and Edvibe account pages

## Run locally
```bash
cd /home/ninja/Desktop/opencode/periodictable
python3 -m http.server 8765
# open http://127.0.0.1:8765/index.html
```

## Files
- `index.html` — semantic page structure, controls, table container, trends lab, modal
- `styles.css` — design tokens, glass components, responsive layout, animations
- `script.js` — rendering, filters/search, modal, trends engine, accessibility/motion handling
- `elements-data.js` — canonical element + trend dataset used by the UI
- `TODO.md` — detailed execution plan and progress tracker

## Data note
Trend values are reference/approximate educational values and may include unavailable (`N/A`) entries where data is not applicable or uncertain. Validate against a canonical source before production/scientific use.
