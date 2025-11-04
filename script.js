document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar")
  const navLinks = document.querySelectorAll(".nav-link")
  const sections = document.querySelectorAll("section[id]")

  // Scroll spy (IntersectionObserver)
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id")
      const link = document.querySelector(`.nav-link[href="#${id}"]`)
      if (!link) return
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"))
        link.classList.add("active")
      }
    })
  }, { rootMargin: "-40% 0px -55% 0px" })
  sections.forEach((sec) => spy.observe(sec))

  // Navbar scroll state
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50)
  }
  onScroll()
  document.addEventListener("scroll", () => requestAnimationFrame(onScroll))

  // Smooth scroll offset
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href")
      if (href === "#" || href.length <= 1) return
      const target = document.getElementById(href.substring(1))
      if (!target) return
      e.preventDefault()
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight
      window.scrollTo({ top, behavior: "smooth" })
    })
  })

  // Fade-in animation
  const appear = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        appear.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" })
  document.querySelectorAll(".fade-in").forEach((el) => appear.observe(el))

  // Parallax effect
  const heroContent = document.querySelector(".hero-content")
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (heroContent && !prefersReduced) {
    const parallax = () => {
      const y = Math.min(window.scrollY, window.innerHeight)
      heroContent.style.transform = `translateY(${y * 0.4}px)`
      heroContent.style.opacity = 1 - y / window.innerHeight
    }
    parallax()
    document.addEventListener("scroll", () => requestAnimationFrame(parallax))
  }

  // Contact form simulation
  const form = document.querySelector(".contact-form")
  const status = document.getElementById("form-status")
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      if (!form.checkValidity()) {
        status.textContent = "Veuillez remplir tous les champs requis."
        return
      }
      const btn = form.querySelector('button[type="submit"]')
      const original = btn.innerHTML
      btn.disabled = true
      btn.innerHTML = "Envoi en cours..."

      setTimeout(() => {
        const name = document.getElementById("name").value || "cher visiteur"
        const toast = document.createElement("div")
        toast.style.cssText =
          "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#8b5cf6,#22d3ee);color:#fff;padding:1.2rem 1.6rem;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,.4);z-index:10000;text-align:center;"
        toast.innerHTML = `<strong>Message envoyé !</strong><div>Merci ${name}, je vous répondrai bientôt.</div>`
        document.body.appendChild(toast)
        form.reset()
        btn.innerHTML = original
        btn.disabled = false
        setTimeout(() => {
          toast.style.opacity = "0"
          toast.style.transition = "opacity 300ms"
          setTimeout(() => toast.remove(), 320)
        }, 2600)
      }, 1200)
    })
  }
})
