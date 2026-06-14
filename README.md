# ShopLite — Client-Side E-Commerce Application

ShopLite is a modern, lightweight, multi-page client-side e-commerce storefront built for the **Front-End Engineering Fundamentals (FEF)** course. It showcases semantic HTML5, custom responsive CSS3 layout grids, and vanilla JavaScript without external logic frameworks. Product items are dynamically populated from a public API, and cart data persists using browser-level storage.

---

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

