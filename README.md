# Edvibe Interactive Periodic Table

A modern, interactive periodic table of elements built for students, educators, and science enthusiasts. Brought to you by [Edvibe](https://edvibe.co.ke/).

## Overview

The Edvibe Interactive Periodic Table is a fully responsive, web-based educational tool covering all 118 chemical elements. It combines a standard periodic table layout with interactive element details, smart filtering, real-time search, and a dedicated Trends Lab for visualizing periodic trends. The interface uses a glassmorphism-inspired dark theme with cyan accents and is designed for both desktop and mobile use.

## Features

- Complete coverage of all 118 elements in a standard periodic table layout, including lanthanides and actinides
- Interactive element details: click or tap any element to open an animated modal with key properties, electron configuration, oxidation states, and a trend snapshot
- Smart filtering by category (metals, metalloids, nonmetals), state, group, and period
- Real-time search by element name, symbol, or atomic number
- Trends Lab visualizing three periodic trends as heatmaps:
  - Electronegativity (Pauling)
  - Atomic Radius (pm)
  - First Ionization Energy (kJ/mol)
- Trends Lab modes: across a period, down a group, and full heatmap view
- Play, pause, and step-through walkthroughs with plain-language explanations
- Staggered tile entrance animations, hover and focus micro-interactions, and modal transitions
- Respect for `prefers-reduced-motion`
- Responsive layout: desktop grid with horizontal scroll on smaller screens and a mobile-friendly modal
- Quick access links to Edvibe Notes, Quizzes, Flashcards, Simulations, and account pages
- Keyboard navigation, visible focus states, and accessibility considerations

## Technology Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript (jQuery 3.6.0) |
| Typography | Inter (Google Fonts) |
| Data | `elements-data.js` (canonical element and trend dataset) |

No build step is required.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for CDN resources (jQuery, Google Fonts)

### Run Locally

Clone the repository and serve the directory with any static server:

```bash
git clone https://github.com/edvibeke/periodictable.git
cd periodictable
python3 -m http.server 8765
```

Then open `http://127.0.0.1:8765/index.html` in your browser.

Alternatively, open `index.html` directly in a browser.

## Project Structure

```
periodictable/
├── index.html          # Semantic page structure, controls, table container, Trends Lab, modal
├── styles.css          # Design tokens, glass components, responsive layout, animations
├── script.js           # Rendering, filters/search, modal, trends engine, accessibility/motion handling
├── elements-data.js    # Canonical element and trend dataset used by the UI
├── TODO.md             # Detailed execution plan and progress tracker
├── filter.png          # Filter illustration asset
├── key.png             # Key illustration asset
├── logo.png            # Edvibe logo
└── README.md           # Project documentation
```

## Usage

- Click or tap any element to open its detailed property panel.
- Use the filter buttons to narrow results by category, state, group, or period.
- Type in the search field to find elements instantly by name, symbol, or atomic number.
- Open the Trends Lab to visualize periodic trends as heatmaps and walkthroughs.
- Use the Edvibe links for Notes, Quizzes, Flashcards, Simulations, and account access.

## Data Note

Trend values are reference and approximate educational values. Some entries are marked as unavailable (`N/A`) where data is not applicable or uncertain, such as noble gas electronegativity. Validate against a canonical source before production or scientific use.

## Browser Support

| Browser | Supported |
|---|---|
| Chrome | Yes |
| Firefox | Yes |
| Safari | Yes |
| Edge | Yes |

Mobile browsers are supported with a responsive layout.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request with a clear description of the change.

## License

All rights reserved. This project is proprietary to Edvibe. Unauthorized copying, modification, or distribution is prohibited without prior written permission.

## Contact

Edvibe - https://edvibe.co.ke/about.php

## Credits

Built and maintained by the Edvibe team.
