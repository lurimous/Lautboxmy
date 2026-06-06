/* ============================================================
   Lautbox Malaysia — app.js
   Vanilla hash-router SPA (works on GitHub Pages, no server config).
   - EN / MY / CN language switching (persisted)
   - Renders page views into #app with a snappy transition
   - Event delegation for variants, filters, WhatsApp orders, form
   Depends on globals from js/data.js and js/i18n.js
   ============================================================ */
(function () {
  "use strict";

  // Site-owner override: motion is forced ON regardless of the OS
  // prefers-reduced-motion setting. (Accessibility tradeoff is intentional.)
  const prefersReduced = false;

  /* ---------- Language state ---------- */
  let LANG = (function () {
    try {
      const s = localStorage.getItem("lautbox-lang");
      if (s && I18N[s]) return s;
    } catch (e) {}
    return "en";
  })();

  const L = () => I18N[LANG];
  function t(path) {
    const v = path.split(".").reduce((o, k) => (o && o[k] != null ? o[k] : null), I18N[LANG]);
    return v == null ? path : v;
  }
  function fill(tpl, vars) {
    return String(tpl).replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ""));
  }

  /* ---------- WhatsApp helpers ---------- */
  function waLink(message) {
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  }
  function orderLink(productName, variant) {
    const parts = [L().wa.orderPrefix, productName, variant].filter(Boolean);
    return waLink(parts.join(" "));
  }

  /* ---------- Icons (lucide-style inline SVG) ---------- */
  const PATHS = {
    snowflake: '<line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',
    waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    badge: '<path d="m9 12 2 2 4-4"/><path d="M12 3 14.5 5.5 18 5l-.5 3.5L21 11l-2.5 2.5L19 17l-3.5-.5L13 20l-2.5-3.5L7 17l.5-3.5L4 11l3-2.5L6.5 5 10 5.5 12 3Z"/>',
    sparkles: '<path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z"/><path d="M19 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16a7 7 0 0 1-7-7"/><path d="M2 22c6-6 9-9 14-11"/>',
    arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  };
  function icon(name, cls) {
    return `<svg class="icon icon--stroke ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${PATHS[name] || ""}</svg>`;
  }
  const WA_ICON = '<svg class="icon icon--fill" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.157 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  /* ---------- Components ---------- */
  function productCard(p) {
    const s = L();
    const badge = p.category === "frozen" ? s.cat.badgeFrozen : s.cat.badgeLive;
    const hasVariants = p.variants.length > 0;
    const multi = p.variants.length > 1;
    let variantsHTML = "";
    if (hasVariants) {
      variantsHTML +=
        (multi ? `<p class="variant-label">${s.common.selectSize}</p>` : "") +
        `<div class="variant-tags" role="group" aria-label="${esc(p.name)}">` +
        p.variants
          .map((v, i) => `<button type="button" class="variant-tag" aria-pressed="${i === 0 ? "true" : "false"}">${esc(v)}</button>`)
          .join("") +
        `</div>`;
    }
    return `
      <li class="product-card" data-category="${p.category}">
        <div class="product-card__media">
          <span class="product-card__badge product-card__badge--${p.category}">${esc(badge)}</span>
          <img src="${IMG(p.image)}" alt="${esc(p.name)}" loading="lazy" width="400" height="400" />
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${esc(p.name)}</h3>
          ${variantsHTML}
          <div class="product-card__foot">
            <a class="btn btn--wa" href="${orderLink(p.name, p.variants[0] || "")}"
               data-order="${esc(p.name)}" target="_blank" rel="noopener"
               aria-label="${esc(s.common.orderWa)}: ${esc(p.name)}">
              ${WA_ICON}<span>${esc(s.common.orderWa)}</span>
            </a>
          </div>
        </div>
      </li>`;
  }

  function filterTabs(active) {
    const s = L();
    const counts = PRODUCTS.reduce((a, p) => ((a[p.category] = (a[p.category] || 0) + 1), a), {});
    const tabs = [
      { key: "all", label: s.cat.all, count: PRODUCTS.length },
      { key: "frozen", label: s.cat.frozen, count: counts.frozen || 0 },
      { key: "live", label: s.cat.live, count: counts.live || 0 },
    ];
    return `<div class="filter-tabs" role="tablist" aria-label="${esc(s.shop.eyebrow)}">${tabs
      .map(
        (tab) =>
          `<button type="button" class="filter-tab" role="tab" data-filter="${tab.key}" aria-selected="${tab.key === active ? "true" : "false"}">${esc(tab.label)} <span class="filter-tab__count">${tab.count}</span></button>`
      )
      .join("")}</div>`;
  }

  function productGrid() {
    return `<ul class="product-grid" id="productGrid">${PRODUCTS.map(productCard).join("")}</ul>`;
  }

  function feature(ic, title, text, accent) {
    return `<div class="feature ${accent ? "feature--accent" : ""}">
      <div class="feature__icon">${icon(ic)}</div>
      <h3 class="feature__title">${title}</h3>
      <p class="feature__text">${text}</p>
    </div>`;
  }

  function ctaBand() {
    const s = L();
    return `<section class="section section--coral text-center">
      <div class="container">
        <h2 class="section-title">${s.home.ctaTitle}</h2>
        <p class="section-sub" style="margin-inline:auto;max-width:46ch">${s.home.ctaSub}</p>
        <div class="mt-2"><a class="btn btn--outline-light btn--lg" href="${waLink(s.wa.general)}" target="_blank" rel="noopener">${WA_ICON} ${s.footer.order}</a></div>
      </div>
    </section>`;
  }

  /* ---------- Views ---------- */
  function viewHome() {
    const s = L();
    const featured = PRODUCTS.slice(0, 4).map(productCard).join("");
    return `
      <section class="hero">
        <span class="deco deco--circle hero__bg1"></span>
        <span class="deco deco--circle hero__bg2"></span>
        <div class="container hero__inner">
          <div>
            <span class="eyebrow hero__eyebrow">${s.home.heroEyebrow}</span>
            <h1 class="hero__title">${s.home.heroTitleA}<br /><em>${s.home.heroTitleB}</em></h1>
            <p class="hero__subtitle">${s.home.heroSub}</p>
            <div class="hero__actions">
              <a class="btn btn--primary btn--lg" href="#/shop" data-link>${s.common.browseMenu} ${icon("arrow")}</a>
              <a class="btn btn--outline-light btn--lg" href="#/contact" data-link>${s.common.contactUs}</a>
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
            <span class="eyebrow">${s.home.whyEyebrow}</span>
            <h2 class="section-title">${s.home.whyTitle}</h2>
            <p class="section-sub">${s.home.whySub}</p>
          </div>
          <div class="grid grid--4">
            ${feature("snowflake", s.home.f1t, s.home.f1x)}
            ${feature("sparkles", s.home.f2t, s.home.f2x, true)}
            ${feature("truck", s.home.f3t, s.home.f3x)}
            ${feature("badge", s.home.f4t, s.home.f4x)}
          </div>
        </div>
      </section>

      <section class="section section--muted">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${s.home.rangeEyebrow}</span>
            <h2 class="section-title">${s.home.rangeTitle}</h2>
          </div>
          <div class="grid grid--2">
            <a class="cat-block cat-block--frozen" href="#/shop?cat=frozen" data-link>
              <span class="deco deco--circle" style="width:160px;height:160px;top:-40px;right:-30px;"></span>
              <span class="cat-block__label">${s.cat.frozen}</span>
              <span class="cat-block__sub">${s.home.frozenSub}</span>
              <span class="cat-block__cta">${s.home.frozenCta} ${icon("arrow")}</span>
            </a>
            <a class="cat-block cat-block--live" href="#/shop?cat=live" data-link>
              <span class="deco deco--square" style="width:150px;height:150px;bottom:-40px;left:-20px;transform:rotate(18deg);"></span>
              <span class="cat-block__label">${s.cat.live}</span>
              <span class="cat-block__sub">${s.home.liveSub}</span>
              <span class="cat-block__cta">${s.home.liveCta} ${icon("arrow")}</span>
            </a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${s.home.picksEyebrow}</span>
            <h2 class="section-title">${s.home.picksTitle}</h2>
          </div>
          <ul class="product-grid">${featured}</ul>
          <div class="text-center mt-2"><a class="btn btn--outline" href="#/shop" data-link>${s.common.viewAll} ${icon("arrow")}</a></div>
        </div>
      </section>

      <section class="section section--navy">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">${s.home.stepsEyebrow}</span>
            <h2 class="section-title">${s.home.stepsTitle}</h2>
          </div>
          <div class="steps">
            <div class="step"><div class="step__num">1</div><h3 class="step__title">${s.home.s1t}</h3><p class="step__text">${s.home.s1x}</p></div>
            <div class="step"><div class="step__num">2</div><h3 class="step__title">${s.home.s2t}</h3><p class="step__text">${s.home.s2x}</p></div>
            <div class="step"><div class="step__num">3</div><h3 class="step__title">${s.home.s3t}</h3><p class="step__text">${s.home.s3x}</p></div>
          </div>
        </div>
      </section>

      ${ctaBand()}
    `;
  }

  function viewShop(query) {
    const s = L();
    const active = ["all", "frozen", "live"].includes(query.cat) ? query.cat : "all";
    return `
      <section class="hero" style="padding-block: clamp(2.5rem,6vw,3.5rem)">
        <span class="deco deco--circle hero__bg1"></span>
        <div class="container">
          <span class="eyebrow hero__eyebrow">${s.shop.eyebrow}</span>
          <h1 class="hero__title" style="font-size:clamp(2rem,5.5vw,3.2rem)">${s.shop.title}</h1>
          <p class="hero__subtitle">${s.shop.sub}</p>
        </div>
      </section>
      <section class="section section--muted">
        <div class="container">
          ${filterTabs(active)}
          ${productGrid()}
        </div>
      </section>
      ${ctaBand()}
    `;
  }

  function viewMerchants() {
    const s = L();
    const cards = MERCHANTS.map((m) => {
      const dir = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.area + ", " + m.state)}`;
      const note = (s.merchants.notes && s.merchants.notes[m.noteKey]) || "";
      const orderMsg = fill(s.wa.merchant, { name: m.name, area: m.area });
      return `<div class="merchant-card">
        <div class="merchant-card__top">
          <span class="merchant-card__pin">${icon("pin")}</span>
          <div>
            <div class="merchant-card__name">${esc(m.name)}</div>
            <div class="merchant-card__state">${esc(m.area)}, ${esc(m.state)}</div>
          </div>
        </div>
        <div class="merchant-card__meta">
          <span>${icon("sparkles")} ${esc(note)}</span>
          <span>${icon("clock")} ${esc(m.hours)}</span>
        </div>
        <div class="merchant-card__actions">
          <a class="btn btn--secondary btn--sm" href="${dir}" target="_blank" rel="noopener">${icon("pin")} ${s.common.directions}</a>
          <a class="btn btn--wa btn--sm" style="width:auto" href="${waLink(orderMsg)}" target="_blank" rel="noopener">${WA_ICON} ${s.common.order}</a>
        </div>
      </div>`;
    }).join("");

    return `
      <section class="hero" style="padding-block: clamp(2.5rem,6vw,3.5rem)">
        <span class="deco deco--circle hero__bg2"></span>
        <div class="container">
          <span class="eyebrow hero__eyebrow">${s.merchants.eyebrow}</span>
          <h1 class="hero__title" style="font-size:clamp(2rem,5.5vw,3.2rem)">${s.merchants.title}</h1>
          <p class="hero__subtitle">${s.merchants.sub}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="grid grid--3">${cards}</div>
          <p class="text-center section-sub mt-2">${s.merchants.demo}</p>
        </div>
      </section>
      ${ctaBand()}
    `;
  }

  function viewAbout() {
    const s = L();
    return `
      <section class="hero" style="padding-block: clamp(2.5rem,6vw,3.5rem)">
        <span class="deco deco--circle hero__bg1"></span>
        <div class="container">
          <span class="eyebrow hero__eyebrow">${s.about.eyebrow}</span>
          <h1 class="hero__title" style="font-size:clamp(2rem,5.5vw,3.4rem)">${s.about.titleA}<br /><em>${s.about.titleB}</em></h1>
        </div>
      </section>

      <section class="section">
        <div class="container grid grid--2" style="align-items:center;gap:clamp(2rem,5vw,4rem)">
          <div class="prose flow">
            <p>${s.about.p1}</p>
            <p>${s.about.p2}</p>
            <p>${s.about.p3}</p>
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
            <div class="stat"><div class="stat__num">18+</div><div class="stat__label">${s.about.l1}</div></div>
            <div class="stat"><div class="stat__num">13</div><div class="stat__label">${s.about.l2}</div></div>
            <div class="stat"><div class="stat__num">100%</div><div class="stat__label">${s.about.l3}</div></div>
            <div class="stat"><div class="stat__num">24h</div><div class="stat__label">${s.about.l4}</div></div>
          </div>
        </div>
      </section>

      <section class="section section--muted">
        <div class="container">
          <div class="section-head"><span class="eyebrow">${s.about.promiseEyebrow}</span><h2 class="section-title">${s.about.promiseTitle}</h2></div>
          <div class="grid grid--3">
            ${feature("badge", s.about.v1t, s.about.v1x)}
            ${feature("snowflake", s.about.v2t, s.about.v2x, true)}
            ${feature("leaf", s.about.v3t, s.about.v3x)}
          </div>
        </div>
      </section>

      ${ctaBand()}
    `;
  }

  function viewContact() {
    const s = L();
    return `
      <section class="hero" style="padding-block: clamp(2.5rem,6vw,3.5rem)">
        <span class="deco deco--circle hero__bg2"></span>
        <div class="container">
          <span class="eyebrow hero__eyebrow">${s.contact.eyebrow}</span>
          <h1 class="hero__title" style="font-size:clamp(2rem,5.5vw,3.2rem)">${s.contact.title}</h1>
          <p class="hero__subtitle">${s.contact.sub}</p>
        </div>
      </section>

      <section class="section">
        <div class="container contact-grid">
          <div class="contact-info">
            <a class="contact-item" href="${waLink(s.wa.general)}" target="_blank" rel="noopener">
              <span class="contact-item__icon" style="color:var(--wa)">${WA_ICON}</span>
              <div><h4>${s.contact.waT}</h4><p>${s.contact.waX}</p></div>
            </a>
            <div class="contact-item">
              <span class="contact-item__icon">${icon("clock")}</span>
              <div><h4>${s.contact.hoursT}</h4><p>${s.contact.hoursX}</p></div>
            </div>
            <div class="contact-item">
              <span class="contact-item__icon">${icon("pin")}</span>
              <div><h4>${s.contact.areaT}</h4><p>${s.contact.areaX}</p></div>
            </div>
            <div class="contact-item">
              <span class="contact-item__icon">${icon("sparkles")}</span>
              <div><h4>${s.contact.followT}</h4><p><a class="link-arrow" href="${SITE.social.instagram}">Instagram</a> · <a class="link-arrow" href="${SITE.social.facebook}">Facebook</a></p></div>
            </div>
          </div>

          <form class="form" id="contactForm" novalidate>
            <div class="field">
              <label for="cf-name">${s.contact.nameLabel}</label>
              <input id="cf-name" name="name" type="text" autocomplete="name" placeholder="${esc(s.contact.namePh)}" required />
            </div>
            <div class="field">
              <label for="cf-message">${s.contact.msgLabel}</label>
              <textarea id="cf-message" name="message" placeholder="${esc(s.contact.msgPh)}" required></textarea>
            </div>
            <button type="submit" class="btn btn--wa">${WA_ICON}<span>${s.contact.send}</span></button>
          </form>
        </div>
      </section>
    `;
  }

  function viewNotFound() {
    const s = L();
    return `<section class="section text-center"><div class="container">
      <span class="eyebrow">404</span>
      <h1 class="section-title">${s.notfound.title}</h1>
      <p class="section-sub">${s.notfound.sub}</p>
      <div class="mt-2"><a class="btn btn--primary" href="#/" data-link>${s.notfound.back} ${icon("arrow")}</a></div>
    </div></section>`;
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
      const tt = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - tt, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (tt < 1) requestAnimationFrame(tick);
    })(start);
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
    if (qs)
      qs.split("&").forEach((pair) => {
        const [k, v] = pair.split("=");
        if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || "");
      });
    return { path: path || "/", query };
  }

  let lastPath = null;
  function render() {
    const { path, query } = parseHash();
    const view = routes[path] || viewNotFound;
    const app = document.getElementById("app");

    const paint = () => {
      app.innerHTML = view(query);
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
    document.querySelectorAll(".site-nav a[data-link]").forEach((a) => {
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

  /* ---------- Language ---------- */
  function buildLangSwitch() {
    const wrap = document.getElementById("langSwitch");
    if (!wrap) return;
    wrap.innerHTML = LANGS.map(
      (l) => `<button type="button" class="lang-btn" data-lang="${l.code}" aria-pressed="${l.code === LANG ? "true" : "false"}">${l.label}</button>`
    ).join("");
  }

  function applyStaticTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = t(el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = v;
    });
  }

  function updateGeneralWaLinks() {
    const href = waLink(L().wa.general);
    document.querySelectorAll("[data-wa-general]").forEach((a) => {
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  function applyHtmlLang() {
    const meta = LANGS.find((l) => l.code === LANG);
    document.documentElement.lang = meta ? meta.html : "en";
  }

  function setLang(code) {
    if (!I18N[code]) return;
    LANG = code;
    try { localStorage.setItem("lautbox-lang", code); } catch (e) {}
    document.querySelectorAll(".lang-btn").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === code ? "true" : "false"));
    applyHtmlLang();
    applyStaticTranslations();
    updateGeneralWaLinks();
    render();
  }

  /* ---------- Global interactions ---------- */
  function bindGlobal() {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // Language switcher
    const ls = document.getElementById("langSwitch");
    if (ls) ls.addEventListener("click", (e) => {
      const b = e.target.closest(".lang-btn");
      if (b) setLang(b.dataset.lang);
    });

    // Mobile menu toggle
    const toggle = document.getElementById("navToggle");
    const nav = document.getElementById("primaryNav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    const app = document.getElementById("app");

    // Delegated clicks inside the routed view
    app.addEventListener("click", (e) => {
      const tag = e.target.closest(".variant-tag");
      if (tag) {
        tag.parentElement.querySelectorAll(".variant-tag").forEach((b) => b.setAttribute("aria-pressed", b === tag ? "true" : "false"));
        return;
      }
      const ftab = e.target.closest(".filter-tab");
      if (ftab) {
        const key = ftab.dataset.filter;
        document.querySelectorAll(".filter-tab").forEach((b) => b.setAttribute("aria-selected", b === ftab ? "true" : "false"));
        document.querySelectorAll("#productGrid .product-card").forEach((card) => {
          card.hidden = !(key === "all" || card.dataset.category === key);
        });
        return;
      }
      const order = e.target.closest("[data-order]");
      if (order) {
        const card = order.closest(".product-card");
        const sel = card && card.querySelector('.variant-tag[aria-pressed="true"]');
        order.href = orderLink(order.dataset.order, sel ? sel.textContent : "");
      }
    });

    // Contact form -> open pre-filled WhatsApp
    app.addEventListener("submit", (e) => {
      const form = e.target.closest("#contactForm");
      if (!form) return;
      e.preventDefault();
      const name = form.querySelector("#cf-name").value.trim();
      const msg = form.querySelector("#cf-message").value.trim();
      if (!msg) { form.querySelector("#cf-message").focus(); return; }
      const s = L();
      const parts = [s.wa.formGreeting, name ? fill(s.wa.formName, { name: name }) : "", msg].filter(Boolean);
      window.open(waLink(parts.join(" ")), "_blank", "noopener");
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    buildLangSwitch();
    bindGlobal();
    applyHtmlLang();
    applyStaticTranslations();
    updateGeneralWaLinks();
    window.addEventListener("hashchange", render);
    render();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
