const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const checklistForm = document.getElementById("checklistForm");
const formFeedback = document.getElementById("formFeedback");
const contactForm = document.getElementById("contactForm");
const contactFeedback = document.getElementById("contactFeedback");
const yearEl = document.getElementById("year");
const accordionButtons = document.querySelectorAll(".accordion-item");
const selfieInput = document.getElementById("selfieInput");
const selfiePreview = document.getElementById("selfiePreview");
const selfiePreviewWrapper = document.getElementById("selfiePreviewWrapper");
const aiForm = document.getElementById("aiForm");
const aiResult = document.getElementById("aiResult");
const navDropdownTriggers = document.querySelectorAll("[data-nav-toggle]");

// update footer year
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// mobile nav toggle
if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navMenu.classList.toggle("open");
  });

  // close mobile menu on link click
  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// mobile dropdown behaviour for nav
if (navDropdownTriggers.length) {
  navDropdownTriggers.forEach((button) => {
    button.addEventListener("click", () => {
      const isDesktop = window.matchMedia("(min-width: 769px)").matches;
      if (isDesktop) return; // hover handles desktop

      const target = button.getAttribute("data-nav-toggle");
      const parent = button.closest(".nav-item");
      const isOpen = parent.classList.contains("open");

      document.querySelectorAll(".nav-item.open").forEach((item) => {
        if (item !== parent) item.classList.remove("open");
      });

      parent.classList.toggle("open", !isOpen);
      button.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

// checklist form handler
if (checklistForm && formFeedback) {
  checklistForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(checklistForm);
    const area = data.get("area");
    const symptoms = data.get("symptoms");
    const duration = data.get("duration");

    formFeedback.textContent = `Checklist saved: ${area} concern, symptoms "${symptoms}" lasting ${duration}. Bring this to your next visit.`;
    checklistForm.reset();
  });
}

// contact form handler
if (contactForm && contactFeedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = data.get("name");
    contactFeedback.textContent = `Thank you, ${name}. A care navigator will email you within 24 hours.`;
    contactForm.reset();
  });
}

// accordion behavior
accordionButtons.forEach((button) => {
  const panel = button.nextElementSibling;
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    if (!expanded) {
      panel.classList.add("open");
      panel.style.height = `${panel.scrollHeight}px`;
    } else {
      panel.classList.remove("open");
      panel.style.height = "0";
    }
  });
});

// selfie preview
if (selfieInput && selfiePreview && selfiePreviewWrapper) {
  selfieInput.addEventListener("change", () => {
    const file = selfieInput.files && selfieInput.files[0];
    if (!file) {
      selfiePreview.src = "";
      selfiePreview.style.display = "none";
      return;
    }
    const url = URL.createObjectURL(file);
    selfiePreview.src = url;
    selfiePreview.style.display = "block";
    const placeholder =
      selfiePreviewWrapper.querySelector(".preview-placeholder");
    if (placeholder) {
      placeholder.style.display = "none";
    }
  });
}

// basic AI-style analysis demo
if (aiForm && aiResult) {
  aiForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(aiForm);
    const skinType = data.get("skinType");
    const sunExposure = data.get("sunExposure");
    const concerns = data.getAll("concerns");

    let summary = "";
    if (skinType) {
      summary += `Detected skin type: ${skinType}. `;
    }
    if (concerns.length) {
      summary += `Key concerns: ${concerns.join(", ")}. `;
    }
    if (sunExposure) {
      summary += `Sun exposure: ${sunExposure}.`;
    }

    const routine = [];
    routine.push("Gentle, fragrance-free cleanser twice daily.");

    if (concerns.includes("acne")) {
      routine.push("Non-comedogenic moisturizer and spot treatment with salicylic acid or benzoyl peroxide.");
    }
    if (concerns.includes("dryness") || skinType === "dry") {
      routine.push("Rich moisturizer with ceramides and hyaluronic acid applied on damp skin.");
    }
    if (concerns.includes("redness") || skinType === "sensitive") {
      routine.push("Avoid harsh exfoliants; choose products labeled for sensitive skin.");
    }
    if (concerns.includes("spots")) {
      routine.push("Targeted serum with niacinamide and vitamin C for tone and dark spots.");
    }
    if (concerns.includes("aging")) {
      routine.push("Night routine including a gentle retinoid, if approved by your dermatologist.");
    }

    if (sunExposure === "medium" || sunExposure === "high") {
      routine.push("Broad-spectrum sunscreen SPF 30 or higher every morning, reapplying every 2 hours in direct sun.");
    }

    const html = `
      <h4>Your sample analysis</h4>
      <p>${summary || "Answer the questions above to see a sample report."}</p>
      <h4>Suggested routine</h4>
      <ul>
        ${routine.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <p><strong>Next step:</strong> share this routine and your selfie with a dermatologist for a personalised plan.</p>
    `;

    aiResult.innerHTML = html;
  });
}

