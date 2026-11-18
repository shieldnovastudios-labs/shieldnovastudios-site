/* ShieldNova Studios — small, dependency-free scripts. */

/* =====================================================================
   SAMPLES — the ONE place to add the concept-ad videos when they exist.

   For each sample, fill in ONE of these (leave the others empty):
     video:  path to an MP4, e.g. "media/halden.mp4" (720×1280, ~2–3 MB, kept
             only in the public site repo; the agency repo ignores site/media)
     drive:  the Google Drive file ID from a share link
             https://drive.google.com/file/d/<THIS PART>/view
             (the file must be shared "Anyone with the link – Viewer")
   Optional:
     poster: a still image (JPG/WebP, ~100 KB) shown before play.
   When video or drive is filled in, the "in production" label disappears
   by itself and the frame becomes a player. "style" picks the poster look
   (halden / northpine / oxbeck) used while there is no video.
   ===================================================================== */
const SAMPLES = [
  {
    brand: "Halden Street Coffee",
    kind: "Presenter ad",
    concept: "A presenter introduces a small-batch roaster.",
    style: "halden",
    video: "media/halden.mp4",
    drive: "",
    poster: "media/halden.jpg"
  },
  {
    brand: "Northpine Knitwear",
    kind: "No-dialogue ad",
    concept: "Wool, weather and movement. Text and music only.",
    style: "northpine",
    video: "media/northpine.mp4",
    drive: "",
    poster: "media/northpine.jpg"
  },
  {
    brand: "Oxbeck Pottery",
    kind: "Product & gift ad",
    concept: "Hand-glazed mugs, wrapped and given. Hands only.",
    style: "oxbeck",
    video: "media/oxbeck.mp4",
    drive: "",
    poster: "media/oxbeck.jpg"
  }
];

/* =====================================================================
   QUOTE_FORM — where the "Send request" form delivers.
   key: the Web3Forms access key (public by design: it only lets people
        send messages TO the agency inbox). Empty = the form falls back
        to opening the visitor's email app, pre-filled.
   ===================================================================== */
const QUOTE_FORM = {
  key: "6685e794-0d16-45df-9d47-6159ea44da35",
  email: "hello@shieldnovastudios.com"
};

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
      if (s.video && !reduceMotion) {
        const v = document.createElement("video");
        v.src = s.video;
        v.muted = true;
        v.loop = true;
        v.autoplay = true;
        v.playsInline = true;
        v.setAttribute("muted", "");
        v.setAttribute("aria-hidden", "true");
        if (s.poster) v.poster = s.poster;
        f.appendChild(v);
      } else {
        f.appendChild(poster(s, false));
      }
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

  /* ---------- quote form ---------- */
  const form = document.querySelector("[data-quote]");
  if (form) {
    const status = form.querySelector("[data-quote-status]");
    const send = form.querySelector(".quote__send");
    form.elements.access_key.value = QUOTE_FORM.key;

    function say(text, isError) {
      status.textContent = text;
      status.classList.toggle("is-error", Boolean(isError));
    }

    /* No key yet: open the visitor's mail app with everything they typed, so nothing is lost. */
    function mailFallback() {
      const f = form.elements;
      const body = "Name: " + f.name.value + "\nEmail: " + f.email.value + "\nStore: " + f.store.value +
        "\nInterested in: " + f.interest.value + "\n\n" + f.message.value;
      window.location.href = "mailto:" + QUOTE_FORM.email + "?subject=" + encodeURIComponent("Quote request") +
        "&body=" + encodeURIComponent(body);
      say("Your email app should open with your request filled in. If it doesn’t, write to " + QUOTE_FORM.email + ".");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let first = null;
      ["name", "email", "message"].forEach(function (n) {
        const input = form.elements[n];
        const ok = input.value.trim() !== "" && (n !== "email" || input.checkValidity());
        input.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok && !first) first = input;
      });
      if (first) {
        say(first.name === "email" && first.value.trim() ? "That email address doesn’t look right." : "Please fill in your name, email and a line about what you sell.", true);
        first.focus();
        return;
      }
      if (form.elements.botcheck.checked) return;   /* spam bot */
      if (!QUOTE_FORM.key) { mailFallback(); return; }

      send.disabled = true;
      send.textContent = "Sending…";
      say("");
      fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok && d.success, d: d }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error((res.d && res.d.message) || "not sent");
          const who = form.elements.email.value;
          form.classList.add("is-sent");
          say("Thanks, your request is in. We’ll reply to " + who + " with a quote and a date.");
          form.reset();
        })
        .catch(function () {
          say("Sorry, it didn’t go through. Please email " + QUOTE_FORM.email + " and we’ll reply the same way.", true);
        })
        .then(function () {
          send.disabled = false;
          send.textContent = "Send request";
        });
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
