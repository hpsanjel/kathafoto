// Hero video: only autoplay when the visitor hasn't asked for reduced motion — otherwise the poster image stands in as a static hero
const heroVideo = document.getElementById("hero-video");
if (heroVideo) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReducedMotion) {
    heroVideo.play().catch(() => {
      // Autoplay blocked (e.g. data-saver mode) — poster image remains visible, which is fine.
    });
  }
}

// Mobile nav overlay
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navOverlay = document.getElementById("nav-overlay");

function openNav() {
  navOverlay.classList.remove("pointer-events-none", "opacity-0");
  navOverlay.classList.add("opacity-100");
  document.body.classList.add("overflow-hidden");
}
function closeNav() {
  navOverlay.classList.add("pointer-events-none", "opacity-0");
  navOverlay.classList.remove("opacity-100");
  document.body.classList.remove("overflow-hidden");
}
navToggle?.addEventListener("click", openNav);
navClose?.addEventListener("click", closeNav);
navOverlay?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

// Scroll-reveal
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
);
revealEls.forEach((el) => revealObserver.observe(el));

// Gallery lightbox — each frame represents a category with its own set of photos
const galleryCategories = document.querySelectorAll("[data-gallery-category]");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");

let currentImages = [];
let currentTitle = "";
let currentIndex = 0;

function renderLightboxImage() {
  const total = currentImages.length;
  lightboxImg.src = currentImages[currentIndex];
  lightboxImg.alt = `${currentTitle} — photo ${currentIndex + 1} of ${total}`;
  lightboxCaption.textContent = currentTitle;
  lightboxCounter.textContent = total > 1 ? `(${currentIndex + 1}/${total})` : "";
  const showNav = total > 1;
  lightboxPrev.classList.toggle("hidden", !showNav);
  lightboxNext.classList.toggle("hidden", !showNav);
}
function openLightbox(images, title, startIndex = 0) {
  currentImages = images;
  currentTitle = title;
  currentIndex = startIndex;
  renderLightboxImage();
  lightbox.classList.remove("pointer-events-none", "opacity-0");
  lightbox.classList.add("opacity-100");
  document.body.classList.add("overflow-hidden");
}
function closeLightbox() {
  lightbox.classList.add("pointer-events-none", "opacity-0");
  lightbox.classList.remove("opacity-100");
  document.body.classList.remove("overflow-hidden");
  lightboxImg.src = "";
}
function showPrev() {
  if (!currentImages.length) return;
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  renderLightboxImage();
}
function showNext() {
  if (!currentImages.length) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  renderLightboxImage();
}

galleryCategories.forEach((frame) => {
  frame.addEventListener("click", () => {
    const images = JSON.parse(frame.dataset.images || "[]");
    const title = frame.dataset.title || "";
    openLightbox(images, title, 0);
  });
});
lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", showPrev);
lightboxNext?.addEventListener("click", showNext);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
    closeNav();
  }
  if (!lightbox.classList.contains("opacity-100")) return;
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});

// Contact form via Web3Forms
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector("button[type='submit']");
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  formStatus.textContent = "";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(contactForm),
    });
    const result = await response.json();

    if (result.success) {
      formStatus.textContent = "Thank you — your message is on its way. We'll reply soon.";
      formStatus.classList.remove("text-red-400");
      formStatus.classList.add("text-brass");
      contactForm.reset();
    } else {
      throw new Error(result.message || "Something went wrong.");
    }
  } catch (err) {
    formStatus.textContent = "Couldn't send right now — please try WhatsApp instead.";
    formStatus.classList.remove("text-brass");
    formStatus.classList.add("text-red-400");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});

// WhatsApp FAB: hidden while the hero (which has its own WhatsApp CTA) is on screen
const heroSection = document.getElementById("hero");
const whatsappFab = document.getElementById("whatsapp-fab");
if (heroSection && whatsappFab) {
  const fabObserver = new IntersectionObserver(
    (entries) => {
      const heroVisible = entries[0].isIntersecting;
      whatsappFab.classList.toggle("opacity-0", heroVisible);
      whatsappFab.classList.toggle("pointer-events-none", heroVisible);
    },
    { threshold: 0 }
  );
  fabObserver.observe(heroSection);
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
