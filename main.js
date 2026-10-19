/* ShieldNova Studios — small, dependency-free scripts. */

/* =====================================================================
   SAMPLES — the ONE place to add the concept-ad videos when they exist.

   For each sample, fill in ONE of these (leave the others empty):
     video:  link to an MP4 file, e.g. "https://.../halden-street.mp4"
             (do not put MP4s in git; host them on Drive/R2/etc.)
     drive:  the Google Drive file ID from a share link
             https://drive.google.com/file/d/<THIS PART>/view
             (the file must be shared "Anyone with the link – Viewer")
   Optional:
     poster: a still image (JPG/WebP, ~100 KB) shown before play.
   When video or drive is filled in, the "in production" label disappears
   by itself and the frame becomes a player. "style" picks the poster look
   (halden / northpine / kettlewren) used while there is no video.
   ===================================================================== */
const SAMPLES = [
  {
    brand: "Halden Street Coffee",
    kind: "Presenter ad",
    concept: "A presenter introduces a small-batch roaster.",
    style: "halden",
    video: "",
    drive: "",
    poster: ""
  },
  {
    brand: "Northpine Knitwear",
    kind: "No-dialogue ad",
    concept: "Wool, weather and movement. Text and music only.",
    style: "northpine",
    video: "",
    drive: "",
    poster: ""
  },
  {
    brand: "Kettlewren",
    kind: "Product & gift ad",
    concept: "Hand-glazed mugs, wrapped and given. Hands only.",
    style: "kettlewren",
    video: "",
    drive: "",
    poster: ""
  }
];

(function () {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  /* A dark poster in the style of the (fictional) brand. Never a fake video. */
  function poster(s, withLabels, tag) {
    const inner = el("div", "frame__inner");
    if (s.poster) {
      const img = el("img", "frame__img");
      img.src = s.poster;
      img.alt = "";
      img.loading = "lazy";
      inner.appendChild(img);
    }
    if (withLabels || tag) inner.appendChild(el("p", "poster__tag", tag || "Example brand · AI-generated"));
    inner.appendChild(el("p", "poster__brand", s.brand));
    inner.appendChild(el("p", "poster__line", s.concept));
    if (withLabels) inner.appendChild(el("p", "poster__stamp", "Concept · fictional brand · in production"));
    return inner;
  }

  /* ---------- hero frames ---------- */
  const hero = document.querySelector("[data-hero-frames]");
  if (hero) {
    hero.innerHTML = "";
    SAMPLES.forEach(function (s) {
      const f = el("div", "frame frame--" + s.style);
      f.appendChild(poster(s, false));
      hero.appendChild(f);
    });
  }

  /* ---------- work grid ---------- */
  const grid = document.querySelector("[data-samples]");
  if (grid) {
    grid.innerHTML = "";
    SAMPLES.forEach(function (s) {
      const li = el("li", "sample reveal");
      const frame = el("div", "frame frame--" + s.style);
      const ready = Boolean(s.video || s.drive);
      const label = s.brand + ", concept ad for a fictional brand, AI-generated";

      if (s.video) {
        const v = document.createElement("video");
        v.src = s.video;
        v.controls = true;
        v.playsInline = true;
        v.preload = "none";
        if (s.poster) v.poster = s.poster;
        v.setAttribute("aria-label", label);
        frame.appendChild(v);
      } else if (s.drive) {
        const f = document.createElement("iframe");
        f.src = "https://drive.google.com/file/d/" + encodeURIComponent(s.drive) + "/preview";
        f.title = label;
        f.loading = "lazy";
        f.allow = "autoplay; fullscreen";
        f.allowFullscreen = true;
        frame.appendChild(f);
      } else {
        frame.appendChild(poster(s, true));
        frame.setAttribute("role", "img");
        frame.setAttribute("aria-label", "Poster for the " + s.brand + " concept ad. Fictional brand; the video is in production.");
      }

      const cap = el("div", "sample__cap");
      cap.appendChild(el("h3", "", s.brand));
      cap.appendChild(el("p", "", s.kind + (ready ? " · concept ad, fictional brand" : " · in production")));
      li.append(frame, cap);
      grid.appendChild(li);
    });
  }

  /* ---------- scroll reveals (content is visible by default; JS only adds the entrance) ---------- */
  const items = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (n) {
      n.classList.add("will-reveal");
      io.observe(n);
    });
  }

  /* ---------- client reels: load Google Drive only on press ---------- */
  document.querySelectorAll("[data-drive]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = btn.getAttribute("data-drive");
      const f = document.createElement("iframe");
      f.src = "https://drive.google.com/file/d/" + encodeURIComponent(id) + "/preview";
      f.title = btn.querySelector(".reel__title").textContent + " (video from Google Drive)";
      f.allow = "autoplay; fullscreen";
      f.allowFullscreen = true;
      btn.parentNode.replaceChild(f, btn);
      f.focus();
    });
  });

  /* ---------- Upwork link not set yet ---------- */
  document.querySelectorAll("[data-upwork]").forEach(function (a) {
    if (a.getAttribute("href") === "#upwork") {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "mailto:hello@shieldnovastudios.com?subject=Quote%20for%20an%20AI%20video%20ad";
      });
    }
  });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
