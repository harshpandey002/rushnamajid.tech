/* Rushna Majid — career portfolio: links, reveals, timeline, counters. */

// ---- Links: fill these in. Buttons whose value is empty stay hidden. ----
const LINKS = {
  linkedin: "https://www.linkedin.com/in/rushana-majid-010154187/",
  instagram: "https://www.instagram.com/____rush___/",
  email: "mailto:rushnamajid16@gmail.com",
  resume: "",           // e.g. "Rushna-Majid-Resume.pdf" (drop the file next to index.html)
};

document.querySelectorAll("[data-link]").forEach((a) => {
  const href = LINKS[a.dataset.link];
  if (href) {
    a.href = href;
    a.hidden = false;
  } else {
    a.hidden = true;
  }
});

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Reveal on scroll ----
const revealIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        revealIO.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealIO.observe(el));

// ---- Count-up numbers ----
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  if (reduceMotion) {
    el.textContent = target.toFixed(decimals);
    return;
  }
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const countIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        countUp(e.target);
        countIO.unobserve(e.target);
      }
    }
  },
  { threshold: 0.5 }
);
document.querySelectorAll("[data-count]").forEach((el) => countIO.observe(el));

// ---- Scroll-driven bits: progress bar, nav state, timeline line ----
const progressBar = document.querySelector(".progress span");
const nav = document.querySelector(".nav");
const timeline = document.querySelector(".timeline");
const tlItems = Array.from(document.querySelectorAll(".tl"));

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("is-scrolled", y > 24);

    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const anchor = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
      timeline.style.setProperty("--tl-progress", p.toFixed(3));
      for (const item of tlItems) {
        const ir = item.getBoundingClientRect();
        item.classList.toggle("is-active", ir.top < anchor);
      }
    }
    ticking = false;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

// ---- Active nav link ----
const sections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(document.querySelectorAll(".nav__links a"));
const sectionIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const id = e.target.id;
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
    }
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => sectionIO.observe(s));

// ---- Hero glow follows the pointer (desktop only) ----
const hero = document.querySelector(".hero");
const glow = document.querySelector(".hero__glow");
if (hero && glow && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    glow.style.setProperty("--mx", `${e.clientX - r.left}px`);
    glow.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}

// ---- Magnetic buttons ----
if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
    });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    });
  });
}
