/* ============================================================
   Lautbox Malaysia — app.js
   Vanilla hash-router SPA (works on GitHub Pages, no server config).
   - Renders page views into #app with a snappy fade transition
   - Components for products, merchants, features, etc.
   - Event delegation for variants, filters, WhatsApp orders, form
   Depends on globals from js/data.js
   ============================================================ */
(function () {
  "use strict";

  // Site-owner override: motion is forced ON regardless of the OS
  // prefers-reduced-motion setting. (Accessibility tradeoff is intentional.)
  const prefersReduced = false;

  /* ---------- WhatsApp helpers ---------- */
  function waLink(message) {
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  }
  function orderLink(productName, variant) {
    const parts = ["Hi Lautbox! I'd like to order:", productName, variant].filter(Boolean);
    return waLink(parts.join(" "));
  }
  const GENERAL_MSG = "Hi Lautbox! I'd like to know more about your fresh seafood.";

  /* ---------- Icons (lucide-style inline SVG) ---------- */
  const PATHS = {
    snowflake: '<line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',
    waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    badge: '<path d="m9 12 2 2 4-4"/><path d="M12 3 14.5 5.5 18 5l-.5 3.5L21 11l-2.5 2.5L19 17l-3.5-.5L13 20l-2.5-3.5L7 17l.5-3.5L4 11l3-2.5L6.5 5 10 5.5 12 3Z"/>',
    sparkles: '<path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    anchor: '<circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16a7 7 0 0 1-7-7"/><path d="M2 22c6-6 9-9 14-11"/>',
  };
  function icon(name, cls) {
    const p = PATHS[name] || "";
    return `<svg class="icon icon--stroke ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${p}</svg>`;
  }
  const WA_ICON = '<svg class="icon icon--fill" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------- Components ---------- */
  function productCard(p) {
    const cat = CATEGORIES[p.category] || {};
    const hasVariants = p.variants.length > 0;
    const multi = p.variants.length > 1;
    let variantsHTML = "";
    if (hasVariants) {
      variantsHTML +=
        (multi ? `<p class="variant-label">Select size</p>` : "") +
        `<div class="variant-tags" role="group" aria-label="${multi ? "Choose a size" : "Size"} for ${esc(p.name)}">` +
        p.variants
          .map((v, i) => `<button type="button" class="variant-tag" aria-pressed="${i === 0 ? "true" : "false"}">${esc(v)}</button>`)
          .join("") +
        `</div>`;
    }
    return `
      <li class="product-card" data-category="${p.category}">
        <div class="product-card__media">
          <span class="product-card__badge product-card__badge--${p.category}">${cat.badge || ""}</span>
          <img src="${IMG(p.image)}" alt="${esc(p.name)}" loading="lazy" width="400" height="400" />
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${esc(p.name)}</h3>
          ${variantsHTML}
          <div class="product-card__foot">
            <a class="btn btn--wa" href="${orderLink(p.name, p.variants[0] || "")}"
               data-order="${esc(p.name)}" target="_blank" rel="noopener"
               aria-label="Order ${esc(p.name)} via WhatsApp">
              ${WA_ICON}<span>Order via WhatsApp</span>
            </a>
          </div>
        </div>
      </li>`;
  }

  function filterTabs(active) {
    const counts = PRODUCTS.reduce((a, p) => ((a[p.category] = (a[p.category] || 0) + 1), a), {});
    const tabs = [{ key: "all", label: "All", count: PRODUCTS.length }].concat(
      Object.keys(CATEGORIES).map((k) => ({ key: k, label: CATEGORIES[k].label, count: counts[k] || 0 }))
    );
    return `<div class="filter-tabs" role="tablist" aria-label="Filter products">${tabs
      .map(
        (t) =>
          `<button type="button" class="filter-tab" role="tab" data-filter="${t.key}" aria-selected="${t.key === active ? "true" : "false"}">${t.label} <span class="filter-tab__count">${t.count}</span></button>`
      )
      .join("")}</div>`;
  }

  function productGrid(active) {
    return `<ul class="product-grid" id="productGrid">${PRODUCTS.map(productCard).join("")}</ul>`;
  }

  function feature(ic, title, text, accent) {
    return `<div class="feature ${accent ? "feature--accent" : ""}">
      <div class="feature__icon">${icon(ic)}</div>
      <h3 class="feature__title">${title}</h3>
      <p class="feature__text">${text}</p>
    </div>`;
  }

  /* ---------- Views ---------- */
  function viewHome() {
    const featured = PRODUCTS.slice(0, 4).map(productCard).join("");
    return `
      <section class="hero">
        <span class="deco deco--circle hero__bg1"></span>
        <span class="deco deco--circle hero__bg2"></span>
        <div class="container hero__inner">
          <div>
            <span class="eyebrow hero__eyebrow">Frozen &amp; Live · Malaysia</span>
            <h1 class="hero__title">Fresh Seafood<br /><em>From Sea To You</em></h1>
            <p class="hero__subtitle">Premium catch — fish, prawns, crab &amp; lobster — cleaned, flash-frozen or kept live, and delivered to your door across Malaysia.</p>
            <div class="hero__actions">
              <a class="btn btn--primary btn--lg" href="#/shop" data-link>Browse the Menu ${icon("arrow")}</a>
              <a class="btn btn--outline-light btn--lg" href="#/contact" data-link>Contact Us</a>
            </div>
          </div>
          <div class="hero__art">
            <span class="deco deco--circle hero__shape-1"></span>
            <span class="deco deco--square hero__shape-2"></span>
            <span class="deco deco--circle hero__shape-3"></span>
            <div class="hero__badge"><img src="${SITE.logo}" alt="Lautbox Malaysia" width="280" height="280" /></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Why Lautbox</span>
            <h2 class="section-title">Quality you can taste</h2>
            <p class="section-sub">From the boat to your kitchen, every step protects freshness.</p>
          </div>
          <div class="grid grid--4">
            ${feature("snowflake", "Flash-Frozen Fresh", "Locked in at peak freshness within hours of the catch.")}
            ${feature("sparkles", "Wild &amp; Premium", "Hand-picked grades like Sabah wild tiger prawn &amp; coral grouper.", true)}
            ${feature("truck", "Nationwide Delivery", "Cold-chain delivery across Peninsular &amp; East Malaysia.")}
            ${feature("badge", "Order in Seconds", "Tap, pick a size, and confirm everything over WhatsApp.")}
          </div>
        </div>
      </section>

      <section class="section section--muted">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Shop by Range</span>
            <h2 class="section-title">Two ways to enjoy the sea</h2>
          </div>
          <div class="grid grid--2">
            <a class="cat-block cat-block--frozen" href="#/shop?cat=frozen" data-link>
              <span class="deco deco--circle" style="width:160px;height:160px;top:-40px;right:-30px;"></span>
              <span class="cat-block__label">Frozen</span>
              <span class="cat-block__sub">Fillets, prawns, tuna saku, abalone &amp; more — ready when you are.</span>
              <span class="cat-block__cta">Shop Frozen ${icon("arrow")}</span>
            </a>
            <a class="cat-block cat-block--live" href="#/shop?cat=live" data-link>
              <span class="deco deco--square" style="width:150px;height:150px;bottom:-40px;left:-20px;transform:rotate(18deg);"></span>
              <span class="cat-block__label">Live Seafood</span>
              <span class="cat-block__sub">Grouper, carp, crab, lobster &amp; mantis shrimp — at their freshest.</span>
              <span class="cat-block__cta">Shop Live ${icon("arrow")}</span>
            </a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Fresh Picks</span>
            <h2 class="section-title">Popular this week</h2>
          </div>
          <ul class="product-grid">${featured}</ul>
          <div class="text-center mt-2"><a class="btn btn--outline" href="#/shop" data-link>View all seafood ${icon("arrow")}</a></div>
        </div>
      </section>

      <section class="section section--navy">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">How It Works</span>
            <h2 class="section-title">Three steps to dinner</h2>
          </div>
          <div class="steps">
            <div class="step"><div class="step__num">1</div><h3 class="step__title">Browse the menu</h3><p class="step__text">Explore our frozen &amp; live ranges and pick your sizes.</p></div>
            <div class="step"><div class="step__num">2</div><h3 class="step__title">Order on WhatsApp</h3><p class="step__text">Tap a product — your order is pre-filled, just hit send.</p></div>
            <div class="step"><div class="step__num">3</div><h3 class="step__title">We deliver fresh</h3><p class="step__text">We confirm, pack cold, and deliver to your door.</p></div>
          </div>
        </div>
      </section>

      ${ctaBand()}
    `;
  }

  function viewShop(query) {
    const active = ["all", "frozen", "live"].includes(query.cat) ? query.cat : "all";
    return `
      <section class="hero" style="padding-block: clamp(2.5rem,6vw,3.5rem)">
        <span class="deco deco--circle hero__bg1"></span>
        <div class="container">
          <span class="eyebrow hero__eyebrow">Our Catch</span>
          <h1 class="hero__title" style="font-size:clamp(2rem,5.5vw,3.2rem)">Frozen &amp; Live Seafood</h1>
          <p class="hero__subtitle">Pick a category, choose a size, tap order — we confirm everything over WhatsApp.</p>
        </div>
      </section>
      <section class="section section--muted">
        <div class="container">
          ${filterTabs(active)}
          ${productGrid(active)}
        </div>
      </section>
      ${ctaBand()}
    `;
  }

  function viewMerchants() {
    const cards = MERCHANTS.map((m) => {
      const dir = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.area + ", " + m.state)}`;
      return `<div class="merchant-card">
        <div class="merchant-card__top">
          <span class="merchant-card__pin">${icon("pin")}</span>
          <div>
            <div class="merchant-card__name">${esc(m.name)}</div>
            <div class="merchant-card__state">${esc(m.area)}, ${esc(m.state)}</div>
          </div>
        </div>
        <div class="merchant-card__meta">
          <span>${icon("sparkles")} ${esc(m.note)}</span>
          <span>${icon("clock")} ${esc(m.hours)}</span>
        </div>
        <div class="merchant-card__actions">
          <a class="btn btn--secondary btn--sm" href="${dir}" target="_blank" rel="noopener">${icon("pin")} Directions</a>
          <a class="btn btn--wa btn--sm" style="width:auto" href="${waLink("Hi Lautbox! I'd like to order from " + m.name + " (" + m.area + ").")}" target="_blank" rel="noopener">${WA_ICON} Order</a>
        </div>
      </div>`;
    }).join("");

    return `
      <section class="hero" style="padding-block: clamp(2.5rem,6vw,3.5rem)">
        <span class="deco deco--circle hero__bg2"></span>
        <div class="container">
          <span class="eyebrow hero__eyebrow">Find Us</span>
          <h1 class="hero__title" style="font-size:clamp(2rem,5.5vw,3.2rem)">Stockists &amp; Pickup Points</h1>
          <p class="hero__subtitle">Our partner outlets and cold-chain hubs across Malaysia. Prefer delivery? Just order on WhatsApp.</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="grid grid--3">${cards}</div>
          <p class="text-center section-sub mt-2">Sample locations shown for demo — real outlets coming soon.</p>
        </div>
      </section>
      ${ctaBand()}
    `;
  }

  function viewAbout() {
    return `
      <section class="hero" style="padding-block: clamp(2.5rem,6vw,3.5rem)">
        <span class="deco deco--circle hero__bg1"></span>
        <div class="container">
          <span class="eyebrow hero__eyebrow">Our Story</span>
          <h1 class="hero__title" style="font-size:clamp(2rem,5.5vw,3.4rem)">Bringing Malaysia<br /><em>closer to the sea</em></h1>
        </div>
      </section>

      <section class="section">
        <div class="container grid grid--2" style="align-items:center;gap:clamp(2rem,5vw,4rem)">
          <div class="prose flow">
            <p><strong>Lautbox Malaysia</strong> started with a simple belief: everyone deserves restaurant-grade seafood at home, without the fuss of a wet market run.</p>
            <p>We work directly with trusted boats and farms — from Sabah's prawn grounds to local grouper cages — then flash-freeze or keep our catch live so it reaches you tasting like the day it was caught.</p>
            <p>No middlemen markups, no mystery. Just honest, traceable seafood, delivered with care.</p>
          </div>
          <div class="hero__art" style="min-height:240px">
            <span class="deco deco--circle hero__shape-1" style="opacity:1"></span>
            <span class="deco deco--square hero__shape-2" style="opacity:1"></span>
            <div class="hero__badge" style="background:var(--muted)"><img src="${SITE.logo}" alt="Lautbox Malaysia" width="260" height="260" /></div>
          </div>
        </div>
      </section>

      <section class="section section--navy">
        <div class="container">
          <div class="stats">
            <div class="stat"><div class="stat__num">18+</div><div class="stat__label">Seafood varieties</div></div>
            <div class="stat"><div class="stat__num">13</div><div class="stat__label">States served</div></div>
            <div class="stat"><div class="stat__num">100%</div><div class="stat__label">Cold-chain handled</div></div>
            <div class="stat"><div class="stat__num">24h</div><div class="stat__label">From catch to freeze</div></div>
          </div>
        </div>
      </section>

      <section class="section section--muted">
        <div class="container">
          <div class="section-head"><span class="eyebrow">What we stand for</span><h2 class="section-title">Our promise</h2></div>
          <div class="grid grid--3">
            ${feature("badge", "Traceable Sourcing", "We know our boats and farms — and we'll tell you where your seafood came from.")}
            ${feature("snowflake", "Unbroken Cold Chain", "Frozen at peak and kept cold the whole way, so quality never drops.", true)}
            ${feature("leaf", "Responsible Catch", "Choosing suppliers who fish and farm with the long term in mind.")}
          </div>
        </div>
      </section>

      ${ctaBand()}
    `;
  }

  function viewContact() {
    return `
      <section class="hero" style="padding-block: clamp(2.5rem,6vw,3.5rem)">
        <span class="deco deco--circle hero__bg2"></span>
        <div class="container">
          <span class="eyebrow hero__eyebrow">Get in touch</span>
          <h1 class="hero__title" style="font-size:clamp(2rem,5.5vw,3.2rem)">Order or ask us anything</h1>
          <p class="hero__subtitle">The fastest way to order is WhatsApp — or drop a message below and we'll open a pre-filled chat for you.</p>
        </div>
      </section>

      <section class="section">
        <div class="container contact-grid">
          <div class="contact-info">
            <a class="contact-item" href="${waLink(GENERAL_MSG)}" target="_blank" rel="noopener">
              <span class="contact-item__icon" style="color:var(--wa)">${WA_ICON}</span>
              <div><h4>WhatsApp</h4><p>Tap to start an order or enquiry</p></div>
            </a>
            <div class="contact-item">
              <span class="contact-item__icon">${icon("clock")}</span>
              <div><h4>Opening Hours</h4><p>${esc(SITE.hours)}</p></div>
            </div>
            <div class="contact-item">
              <span class="contact-item__icon">${icon("pin")}</span>
              <div><h4>Service Area</h4><p>Klang Valley &amp; nationwide delivery across Malaysia 🇲🇾</p></div>
            </div>
            <div class="contact-item">
              <span class="contact-item__icon">${icon("sparkles")}</span>
              <div><h4>Follow Us</h4><p><a class="link-arrow" href="${SITE.social.instagram}">Instagram</a> · <a class="link-arrow" href="${SITE.social.facebook}">Facebook</a></p></div>
            </div>
          </div>

          <form class="form" id="contactForm" novalidate>
            <div class="field">
              <label for="cf-name">Your name</label>
              <input id="cf-name" name="name" type="text" autocomplete="name" placeholder="e.g. Aisyah" required />
            </div>
            <div class="field">
              <label for="cf-message">Message</label>
              <textarea id="cf-message" name="message" placeholder="What would you like to order or ask?" required></textarea>
            </div>
            <button type="submit" class="btn btn--wa">${WA_ICON}<span>Send via WhatsApp</span></button>
          </form>
        </div>
      </section>
    `;
  }

  function viewNotFound() {
    return `<section class="section text-center"><div class="container">
      <span class="eyebrow">404</span>
      <h1 class="section-title">Page not found</h1>
      <p class="section-sub">That page drifted out to sea.</p>
      <div class="mt-2"><a class="btn btn--primary" href="#/" data-link>Back home ${icon("arrow")}</a></div>
    </div></section>`;
  }

  function ctaBand() {
    return `<section class="section section--coral text-center">
      <div class="container">
        <h2 class="section-title">Ready for the freshest catch?</h2>
        <p class="section-sub" style="margin-inline:auto;max-width:46ch">Order in seconds — we'll confirm your seafood and delivery on WhatsApp.</p>
        <div class="mt-2"><a class="btn btn--outline-light btn--lg" href="${waLink(GENERAL_MSG)}" target="_blank" rel="noopener">${WA_ICON} Order on WhatsApp</a></div>
      </div>
    </section>`;
  }

  /* ---------- Router ---------- */
  const routes = {
    "/": viewHome,
    "/shop": viewShop,
    "/merchants": viewMerchants,
    "/about": viewAbout,
    "/contact": viewContact,
  };

  function parseHash() {
    const raw = location.hash.replace(/^#/, "") || "/";
    const [path, qs] = raw.split("?");
    const query = {};
    if (qs) qs.split("&").forEach((pair) => {
      const [k, v] = pair.split("=");
      if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
    return { path: path || "/", query };
  }

  /* ---------- Scroll-reveal + count-up (re-run after each paint) ---------- */
  const REVEAL_SEL = ".section-head,.feature,.cat-block,.product-card,.step,.stat,.merchant-card,.contact-item,.prose,.form";

  function initMotion(scope) {
    const items = scope.querySelectorAll(REVEAL_SEL);
    const nums = scope.querySelectorAll(".stat__num");

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const revealIO = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );

    items.forEach((el) => {
      const parent = el.parentElement;
      const idx = parent ? Array.prototype.indexOf.call(parent.children, el) : 0;
      el.style.setProperty("--reveal-delay", (idx % 6) * 70 + "ms");
      el.classList.add("will-reveal");
      revealIO.observe(el);
    });

    if (nums.length) {
      const numIO = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              countUp(e.target);
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      nums.forEach((n) => numIO.observe(n));
    }
  }

  function countUp(el) {
    const m = String(el.textContent).match(/^(\d+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1], 10);
    const suffix = m[2] || "";
    const dur = 1100;
    const start = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  let lastPath = null;
  function render() {
    const { path, query } = parseHash();
    const view = routes[path] || viewNotFound;
    const app = document.getElementById("app");

    const paint = () => {
      app.innerHTML = view(query);
      // restart entrance animation
      app.classList.remove("route-view");
      void app.offsetWidth;
      app.classList.add("route-view");
      window.scrollTo(0, 0);
      setActiveNav(path);
      closeMenu();
      initMotion(app);
    };

    if (lastPath !== null && !prefersReduced) {
      app.classList.add("is-leaving");
      setTimeout(() => {
        app.classList.remove("is-leaving");
        paint();
      }, 160);
    } else {
      paint();
    }
    lastPath = path;
  }

  function setActiveNav(path) {
    document.querySelectorAll('.site-nav a[data-link]').forEach((a) => {
      const target = a.getAttribute("href").replace(/^#/, "").split("?")[0] || "/";
      a.classList.toggle("is-active", target === path);
    });
  }

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    const nav = document.getElementById("primaryNav");
    const toggle = document.getElementById("navToggle");
    if (nav) nav.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  /* ---------- Global interactions (event delegation) ---------- */
  function bindGlobal() {
    // General WhatsApp links (header + footer)
    document.querySelectorAll("[data-wa-general]").forEach((a) => {
      a.href = waLink(GENERAL_MSG);
      a.target = "_blank";
      a.rel = "noopener";
    });

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // Mobile menu toggle
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("primaryNav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
    }

    // Delegated clicks inside the routed view
    document.getElementById("app").addEventListener("click", (e) => {
      // Variant selection
      const tag = e.target.closest(".variant-tag");
      if (tag) {
        tag.parentElement.querySelectorAll(".variant-tag").forEach((b) =>
          b.setAttribute("aria-pressed", b === tag ? "true" : "false")
        );
        return;
      }
      // Category filter tabs
      const ftab = e.target.closest(".filter-tab");
      if (ftab) {
        const key = ftab.dataset.filter;
        document.querySelectorAll(".filter-tab").forEach((b) =>
          b.setAttribute("aria-selected", b === ftab ? "true" : "false")
        );
        document.querySelectorAll("#productGrid .product-card").forEach((card) => {
          card.hidden = !(key === "all" || card.dataset.category === key);
        });
        return;
      }
      // Order button — rebuild link from current selected variant
      const order = e.target.closest("[data-order]");
      if (order) {
        const card = order.closest(".product-card");
        const sel = card && card.querySelector('.variant-tag[aria-pressed="true"]');
        order.href = orderLink(order.dataset.order, sel ? sel.textContent : "");
        // let the default anchor navigation proceed
      }
    });

    // Contact form -> open pre-filled WhatsApp
    document.getElementById("app").addEventListener("submit", (e) => {
      const form = e.target.closest("#contactForm");
      if (!form) return;
      e.preventDefault();
      const name = form.querySelector("#cf-name").value.trim();
      const msg = form.querySelector("#cf-message").value.trim();
      if (!msg) { form.querySelector("#cf-message").focus(); return; }
      const text = `Hi Lautbox! ${name ? "I'm " + name + ". " : ""}${msg}`;
      window.open(waLink(text), "_blank", "noopener");
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    bindGlobal();
    window.addEventListener("hashchange", render);
    render();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
