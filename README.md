
##  Project Structure

```text
fef-shoplite/
├── index.html          # Homepage with hero banner and product catalog
├── product.html        # Product details page with parameters reader
├── cart.html           # Cart inspector page with quantities and removal modifiers
├── register.html       # Registration form with live inline validation feedback
├── css/
│   └── style.css       # Main design system containing custom HSL theme & loaders
└── js/
    ├── api.js          # API service endpoints utilizing fetch + async/await
    ├── cart.js         # Cart localStorage operations and page rendering UI
    ├── home.js         # Homepage controller (Search, Filters, Sort pills)
    ├── product.js      # Details page rendering controller
    └── register.js     # Form validation constraints and feedback emitters
```
Link web deploy: https://beamish-mandazi-0c6897.netlify.app/
---
All 4 pages linked via shared navbar: 1.0
Semantic HTML and valid structure: 1.0
Home page fetches and renders product list via DOM: 1.5
Detail page displays correct product by ID: 1.0
Registration form basic JS validation: 1.0
Basic responsiveness (no layout breakage): 0.5
Full cart functionality with localStorage persistence: 1.0
Search or filter by category: 0.5
Skipped: Proper loading/error states (temporary blank screen allowed): 0.0 (-0.3)
Skipped: Hand-written, flawless 3-breakpoint responsive design: 0.0 (-0.2)
Pagination or "load more" implementation: +0.3 
Basic product sorting : +0.4
Skipped: Event delegation, navbar cart badge, toast notifications, search debounce, and code modularization: 0.0, no git history -0.5
Total: 7.4
