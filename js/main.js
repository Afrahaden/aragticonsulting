
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const topButton = document.querySelector(".back-to-top");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const year = document.getElementById("year");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  // Update copyright year.
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // Header and back-to-top button.
  function updateScrollState() {
    const scrolled = window.scrollY > 30;

    header?.classList.toggle("scrolled", scrolled);

    topButton?.classList.toggle(
      "visible",
      window.scrollY > 450
    );
  }

  updateScrollState();

  window.addEventListener("scroll", updateScrollState, {
    passive: true
  });

  topButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "instant" : "smooth"
    });
  });

  // Mobile navigation.
  function closeMenu() {
    if (!menuButton || !nav) return;

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");

    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  }

  menuButton?.addEventListener("click", () => {
    const expanded =
      menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute(
      "aria-expanded",
      String(!expanded)
    );

    menuButton.setAttribute(
      "aria-label",
      expanded ? "Open navigation" : "Close navigation"
    );

    nav?.classList.toggle("open", !expanded);

    document.body.classList.toggle(
      "menu-open",
      !expanded
    );
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const wasOpen =
        menuButton?.getAttribute("aria-expanded") === "true";

      closeMenu();

      if (wasOpen) {
        menuButton?.focus();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      closeMenu();
    }
  });

  // Scroll reveal animations.
  const revealItems = document.querySelectorAll(".reveal");

  if (
    reduceMotion.matches ||
    !("IntersectionObserver" in window)
  ) {
    revealItems.forEach(item => {
      item.classList.add("in-view");
    });
  } else {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 40px 0px"
      }
    );

    revealItems.forEach(item => {
      observer.observe(item);
    });
  }

  // Contact form: Formspree integration.
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  if (form) {
    const submitButton = form.querySelector(
      'button[type="submit"]'
    );

    const formEndpoint =
      form.getAttribute("action") ||
      "https://formspree.io/f/mwllypol";

    const originalButtonContent =
      submitButton?.innerHTML || "";

    let isSubmitting = false;

    function showFeedback(message, isSuccess = false) {
      if (!feedback) return;

      feedback.textContent = message;
      feedback.style.color = isSuccess
        ? "#159C91"
        : "#B42318";
    }

    function setSubmitting(submitting) {
      isSubmitting = submitting;

      if (!submitButton) return;

      submitButton.disabled = submitting;

      if (submitting) {
        submitButton.textContent = "Sending...";
        submitButton.setAttribute("aria-busy", "true");
      } else {
        submitButton.innerHTML = originalButtonContent;
        submitButton.removeAttribute("aria-busy");
      }
    }

    form.addEventListener("submit", async event => {
      event.preventDefault();

      if (isSubmitting) return;

      if (!form.reportValidity()) return;

      const formData = new FormData(form);

      // Remove unnecessary surrounding whitespace.
      for (const field of [
        "name",
        "email",
        "subject",
        "message"
      ]) {
        const value = formData.get(field);

        if (typeof value === "string") {
          formData.set(field, value.trim());
        }
      }

      const name = String(
        formData.get("name") || ""
      ).trim();

      const email = String(
        formData.get("email") || ""
      ).trim();

      const subject = String(
        formData.get("subject") || ""
      ).trim();

      const message = String(
        formData.get("message") || ""
      ).trim();

      if (!name || !email || !subject || !message) {
        showFeedback(
          "Please complete all required fields before sending."
        );
        return;
      }

      setSubmitting(true);

      showFeedback("");

      try {
        const response = await fetch(formEndpoint, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          form.reset();

          showFeedback(
            "Thank you! Your message has been sent successfully. " +
            "We'll review your enquiry and get back to you.",
            true
          );

          return;
        }

        let errorMessage =
          "We couldn't send your message. " +
          "Please try again later.";

        const result = await response.json().catch(
          () => null
        );

        if (
          result &&
          Array.isArray(result.errors) &&
          result.errors.length > 0
        ) {
          const messages = result.errors
            .map(error => error.message)
            .filter(message => typeof message === "string");

          if (messages.length > 0) {
            errorMessage = messages.join(" ");
          }
        }

        showFeedback(errorMessage);
      } catch (error) {
        showFeedback(
          "A network error occurred. Please check your " +
          "internet connection and try again."
        );
      } finally {
        setSubmitting(false);
      }
    });
  }
});
