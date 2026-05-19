document.addEventListener("DOMContentLoaded", function() {
  const mobileBtn = document.getElementById("mobileBtn");
  const menu = document.getElementById("menu");
  mobileBtn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("menu-open");
    if (!isOpen) {
      document.querySelectorAll('.dropdown.open').forEach((drop) => {
        drop.classList.remove('open');
        const toggle = drop.querySelector('.dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Dropdown behaviour: desktop uses CSS hover; mobile toggles submenu on click
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach((toggle) => {
    const parent = toggle.closest('.dropdown');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function(evt) {
      if (window.matchMedia("(max-width:768px)").matches) {
        evt.preventDefault();
        const openDropdown = document.querySelector('.dropdown.open');
        if (openDropdown && openDropdown !== parent) {
          openDropdown.classList.remove('open');
          const openToggle = openDropdown.querySelector('.dropdown-toggle');
          if (openToggle) openToggle.setAttribute('aria-expanded', 'false');
        }
        const isOpen = parent.classList.toggle('open');
        this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        return;
      }
    });
  });

  // Close open dropdown when clicking outside
  document.addEventListener('click', function(e) {
    const open = document.querySelector('.dropdown.open');
    if (!open) return;
    if (e.target.closest('.dropdown') !== open) {
      open.classList.remove('open');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function(event) {
      const targetId = this.getAttribute("href");
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({behavior: "smooth", block: "start"});
          if (window.innerWidth < 768) {
            menu.classList.remove("menu-open");
          }
        }
      }
    });
  });

  const sections = document.querySelectorAll(".hero, .section, .cta-banner, .footer");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, {threshold: 0.15});
  sections.forEach((section) => {
    section.classList.add("fade-section");
    observer.observe(section);
  });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, {threshold: 0.15});
  document.querySelectorAll(".animated-card").forEach((card) => {
    cardObserver.observe(card);
  });

  const contactForm = document.getElementById("contactForm");
  const successPopup = document.getElementById("successPopup");
  const errorPopup = document.getElementById("errorPopup");
  const popupCloseButtons = document.querySelectorAll(".popup-close");

  function showPopup(popup) {
    if (!popup) return;
    popup.classList.add("visible");
  }

  function hidePopup(popup) {
    if (!popup) return;
    popup.classList.remove("visible");
  }

  if (contactForm && typeof emailjs !== "undefined") {
    emailjs.init("TQnM6WjcwRceWW1pz");

    contactForm.addEventListener("submit", function(event) {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const phone = formData.get("phone");
      const message = formData.get("message");

      emailjs.send("service_84sel4l", "template_b39n3cd", {
        name,
        email,
        phone,
        message
      })
      .then(function() {
        contactForm.reset();
        showPopup(successPopup);
      })
      .catch(function(error) {
        console.error("EmailJS error:", error);
        showPopup(errorPopup);
      });
    });

    popupCloseButtons.forEach((button) => {
      button.addEventListener("click", function() {
        hidePopup(this.closest(".success-popup"));
      });
    });
  }
});
