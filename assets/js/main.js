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

// Gallery lightbox
const galleryFrames = document.querySelectorAll("[data-gallery-frame]");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCaption.textContent = caption || "";
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
galleryFrames.forEach((frame) => {
  frame.addEventListener("click", () => {
    const img = frame.querySelector("img");
    openLightbox(img.src, img.alt);
  });
});
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
    closeNav();
  }
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
