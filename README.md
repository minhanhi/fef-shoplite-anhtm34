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

---

## ⚡ Key Features Implemented

*   **Responsive Framework Grid & Custom CSS**: Leverages Bootstrap 5 CDN for grids, layouts, and responsive gutters, coupled with custom variables in `css/style.css` for a premium, custom interface (glassmorphic navbar, card elevation transitions, custom scrollbars, and buttons).
*   **API Service Layer**: Centralized API service in `js/api.js` using `async/await` and validation of HTTP response statuses (`response.ok`).
*   **Client-Side Catalog Enhancements**:
    *   **Search**: Real-time title & description matching.
    *   **Category Pills**: Populated dynamically via categories endpoints.
    *   **Sorting**: Dynamically reorganizes elements by price.
*   **Performance-optimized Event Delegation**: Used on both the product grids (`index.html`) and cart items list (`cart.html`) to bind events to a single parent element instead of attaching click handlers to hundreds of dynamic children.
*   **State Management (Cart)**: Synchronized array persisted in `localStorage`. Includes a live updating cart count badge synchronized across all 4 pages.
*   **Form Validation**: Rigid input validation for names, standard emails, complex password rules (requiring uppercase, lowercase, and numbers with a visual strength meter), phone regex verification, selects, and checkboxes.

---

## 🎓 Oral Exam Defense Guide (Prep Q&A)

Use these questions and answers to prepare for and defend your project work in front of course examiners.

### Q1: Why did you centralize API requests in `api.js` instead of calling `fetch()` directly in each page script?
> **Answer**: Centralizing API operations in `api.js` enforces **Separation of Concerns (SoC)** and code reusability. If the base URL, authentication headers, or response format changes in the future, we only modify a single file (`api.js`) rather than rewriting fetch calls across `home.js` and `product.js`. It also allows us to handle general fetch errors (`try/catch`) in one place.

### Q2: What is the difference between `localStorage` and `sessionStorage`? Why did you use `localStorage` for the cart?
> **Answer**: 
> *   `localStorage` persists data indefinitely. Closing the browser window or computer does not wipe the stored values.
> *   `sessionStorage` only persists data for the duration of the page session (wiped once the browser tab is closed).
> *   We used `localStorage` for the cart because users expect their shopping cart items to remain saved if they close their browser and return later.

### Q3: Explain "Event Delegation" and how you implemented it in this project.
> **Answer**: Event Delegation is a DOM pattern where we attach a single event listener to a parent element (e.g., `#productGrid` or `#cartItemsContainer`) rather than attaching listeners to each individual child button. 
> When a child button is clicked, the click event bubbles up the DOM tree to the parent. In the parent's listener, we analyze `e.target` using `.closest()` to identify which button triggered the click and read its custom data attributes (like `data-id`).
> **Benefits**:
> 1. **Memory efficiency**: One listener instead of dozens or hundreds.
> 2. **Dynamic content support**: Buttons added to the page dynamically after page load are automatically handled without needing to bind new listeners.

### Q4: Why did you use `async/await` instead of standard Promise `.then()` chains?
> **Answer**: `async/await` is syntactic sugar on top of JavaScript Promises. It makes asynchronous code look and behave more like synchronous code, improving code readability and stack trace tracing. It also allows us to use standard `try/catch` blocks for cleaner error handling, rather than chaining `.catch()` statements.

### Q5: How did you implement responsive design for mobile screens?
> **Answer**: We achieved this through a combined approach:
> 1. **Bootstrap 5 grid** row and col utilities (`col-md-6`, `col-lg-4`, etc.) which automatically resize and stack columns depending on viewport breakpoints.
> 2. **CSS Media Queries** in `css/style.css` (e.g., `@media (max-width: 576px)`) to customize details specific to phone layouts—such as centering hero texts, reducing image wrapper heights, and shifting grid layouts.

### Q6: How does the email validation rule prevent injection or bad submissions?
> **Answer**: The registration form hooks into the `submit` event of the form, calls `e.preventDefault()` to block the browser's default reload action, and evaluates each field. For the email, it tests the input string against a regular expression (regex) `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`. If it fails, we render an error message under the field, append the `.is-invalid` visual indicator, and block form submission.
