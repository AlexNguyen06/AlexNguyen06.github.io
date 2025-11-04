// script.js — Portfolio Dark Purple

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const heroContent = document.querySelector(".hero-content");
  const scrollIndicator = document.querySelector(".scroll-indicator");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------
   * 1) Scroll Spy via IntersectionObserver
   * -------------------------------------- */
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!link) return;

        if (entry.isIntersecting) {
          navLinks.forEach((l) => {
            l.classList.remove("active");
            l.removeAttribute("aria-current");
          });
          link.classList.add("active");
          link.setAttribute("aria-current", "true");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
  );
  sections.forEach((sec) => spy.observe(sec));

  /* --------------------------------------
   * 2) Navbar shadow on scroll (rAF)
   * -------------------------------------- */
  const onScrollNavbar = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  };
  onScrollNavbar(); // init
  document.addEventListener(
    "scroll",
    () => requestAnimationFrame(onScrollNavbar),
    { passive: true }
  );

  /* --------------------------------------
   * 3) Smooth Scroll with offset (anchors)
   * -------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#" || href.length <= 1) return;
      const target = document.getElementById(href.substring(1));
      if (!target) return;

      e.preventDefault();
      const navH = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: "smooth" });

      // Optional: set hash without jumping
      history.pushState(null, "", `#${target.id}`);
    });
  });

  /* --------------------------------------
   * 4) Fade-in appearance for .fade-in
   * -------------------------------------- */
  const appear = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          appear.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".fade-in").forEach((el) => appear.observe(el));

  /* --------------------------------------
   * 5) Light Parallax on hero (respect R-M)
   * -------------------------------------- */
  if (heroContent && !prefersReduced) {
    const parallax = () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      const rate = y * 0.4;
      heroContent.style.transform = `translateY(${rate}px)`;
      heroContent.style.opacity = String(1 - y / window.innerHeight);
    };
    parallax(); // init
    document.addEventListener(
      "scroll",
      () => requestAnimationFrame(parallax),
      { passive: true }
    );
  }

  /* --------------------------------------
   * 6) Hide scroll indicator after scroll
   * -------------------------------------- */
  if (scrollIndicator) {
    const toggleIndicator = () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = "0";
        scrollIndicator.style.pointerEvents = "none";
      } else {
        scrollIndicator.style.opacity = "1";
        scrollIndicator.style.pointerEvents = "auto";
      }
    };
    toggleIndicator();
    document.addEventListener(
      "scroll",
      () => requestAnimationFrame(toggleIndicator),
      { passive: true }
    );
  }

  /* --------------------------------------
   * 7) Contact form (simulation + ARIA)
   * -------------------------------------- */
  const form = document.querySelector(".contact-form");
  const status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        if (status) status.textContent = "Veuillez remplir tous les champs requis.";
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.innerHTML : null;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = "<span>Envoi en cours...</span>";
      }

      setTimeout(() => {
        const nameInput = document.getElementById("name");
        const name =
          (nameInput && "value" in nameInput && nameInput.value) || "cher/ère visiteur·euse";

        // Toast center
        const toast = document.createElement("div");
        toast.setAttribute("role", "alert");
        toast.style.cssText =
          "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#8b5cf6,#22d3ee);color:#fff;padding:1.2rem 1.6rem;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,.4);z-index:10000;text-align:center;";
        toast.innerHTML = `<strong>Message envoyé !</strong><div style="opacity:.9;margin-top:.3rem;">Merci ${name}, je vous répondrai bientôt.</div>`;
        document.body.appendChild(toast);

        form.reset();
        if (status) status.textContent = "Votre message a été envoyé (simulation).";
        if (btn && original) {
          btn.innerHTML = original;
          btn.disabled = false;
        }

        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transition = "opacity 300ms";
          setTimeout(() => toast.remove(), 320);
        }, 2600);
      }, 1200);
    });
  }
});
