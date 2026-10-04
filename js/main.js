(function () {
  /* ---------- Izbornik ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const mq = window.matchMedia("(max-width: 56.25rem)");

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
  }

  function closeNav() {
    setNavOpen(false);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    mq.addEventListener("change", (e) => {
      if (!e.matches) closeNav();
    });
  }

  /* ---------- Bez zumiranja (iOS Safari ignorira viewport pa blokiramo geste) ---------- */
  ["gesturestart", "gesturechange", "gestureend"].forEach((evt) => {
    document.addEventListener(evt, (e) => e.preventDefault());
  });
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false }
  );

  /* ---------- Kontakt forma ---------- */
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = form.querySelector(".form-status");
      if (status) {
        status.textContent =
          "Thanks — wire this form to your email or backend when you're ready.";
      }
    });
  }

  /* ---------- Galerija eventa ----------
     Traži slike 01.jpg, 02.jpg, ... u mapi iz data-folder
     i prikazuje samo one koje postoje. */
  const gallery = document.querySelector("[data-gallery]");
  if (gallery) {
    const folder = gallery.dataset.folder;
    const max = parseInt(gallery.dataset.max, 10) || 40;
    const found = [];
    let pending = max;

    const finish = () => {
      if (--pending > 0) return;
      found.sort((a, b) => a.n - b.n);
      if (!found.length) {
        const empty = document.createElement("p");
        empty.className = "empty-state";
        empty.textContent = "Fotografije s eventa uskoro.";
        gallery.appendChild(empty);
        return;
      }
      found.forEach((item, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gallery__item";
        btn.setAttribute("aria-label", "Otvori fotografiju " + (index + 1));
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = "";
        img.loading = "lazy";
        btn.appendChild(img);
        btn.addEventListener("click", () => openLightbox(index));
        gallery.appendChild(btn);
      });
      lightboxSources = found.map((f) => f.src);
    };

    for (let n = 1; n <= max; n++) {
      const src = folder + "/" + String(n).padStart(2, "0") + ".jpg";
      const probe = new Image();
      probe.onload = () => {
        found.push({ n, src });
        finish();
      };
      probe.onerror = finish;
      probe.src = src;
    }
  }

  /* ---------- Lightbox ---------- */
  let lightboxSources = [];
  let current = 0;
  let box;
  let boxImg;

  function buildLightbox() {
    box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Pregled fotografije");
    box.innerHTML =
      '<button type="button" class="lightbox__btn lightbox__close" aria-label="Zatvori">&times;</button>' +
      '<button type="button" class="lightbox__btn lightbox__prev" aria-label="Prethodna">&#8249;</button>' +
      '<img class="lightbox__img" alt="" />' +
      '<button type="button" class="lightbox__btn lightbox__next" aria-label="Sljedeća">&#8250;</button>';
    document.body.appendChild(box);
    boxImg = box.querySelector(".lightbox__img");
    box.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
    box.querySelector(".lightbox__prev").addEventListener("click", () => step(-1));
    box.querySelector(".lightbox__next").addEventListener("click", () => step(1));
    box.addEventListener("click", (e) => {
      if (e.target === box) closeLightbox();
    });
    let startX = 0;
    box.addEventListener("touchstart", (e) => {
      startX = e.changedTouches[0].clientX;
    });
    box.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
  }

  function show() {
    boxImg.src = lightboxSources[current];
  }

  function step(dir) {
    current = (current + dir + lightboxSources.length) % lightboxSources.length;
    show();
  }

  function openLightbox(index) {
    if (!box) buildLightbox();
    current = index;
    show();
    box.classList.add("is-open");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    box.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
  }
})();
