const root = document.documentElement;
const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const revealItems = document.querySelectorAll("[data-reveal]");
const tiltItems = document.querySelectorAll("[data-tilt]");
const parallaxItems = document.querySelectorAll("[data-parallax]");

const updateScroll = () => {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = window.scrollY / max;
  root.style.setProperty("--scroll-progress", progress.toFixed(4));

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0);
    item.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
  });
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-2px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

window.addEventListener("scroll", updateScroll, { passive: true });
window.addEventListener("resize", updateScroll);
updateScroll();
