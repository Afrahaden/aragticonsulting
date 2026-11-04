"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const topButton = document.querySelector(".back-to-top");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const year = document.getElementById("year");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (year) year.textContent = String(new Date().getFullYear());

  function updateScrollState() {
    const scrolled = window.scrollY > 30;
    header?.classList.toggle("scrolled", scrolled);
    topButton?.classList.toggle("visible", window.scrollY > 450);
  }

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });

  topButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "instant" : "smooth"
    });
  });

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    nav?.classList.toggle("open", !expanded);
    document.body.classList.toggle("menu-open", !expanded);
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const wasOpen = menuButton?.getAttribute("aria-expanded") === "true";
      closeMenu();
      if (wasOpen) menuButton?.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) closeMenu();
  });

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach(item => item.classList.add("in-view"));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px 40px 0px" });

    revealItems.forEach(item => observer.observe(item));
  }

  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  // Replace this value with the verified official address before publication.
  const OFFICIAL_EMAIL = "info@aragticonsulting.com";

  form?.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (!OFFICIAL_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(OFFICIAL_EMAIL)) {
      feedback.textContent =
        "Email sending is not configured yet. Please add Aragti Consulting's official email address before using this form.";
      return;
    }

    const data = new FormData(form);
    const subject = String(data.get("subject") || "").trim();
    const body = [
      "Aragti Consulting Website Enquiry",
      "",
      "Name: " + String(data.get("name") || "").trim(),
      "Email: " + String(data.get("email") || "").trim(),
      "",
      "Message:",
      String(data.get("message") || "").trim()
    ].join("\n");

    const mailto = "mailto:" + OFFICIAL_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    feedback.textContent =
      "Your email application should open with a prepared message. Please send it from there.";
    window.location.href = mailto;
  });
});
