const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const header = document.querySelector(".header");
const contactForm = document.getElementById("contactForm");
const feedback = document.getElementById("formFeedback");

const fields = [
  {
    input: document.getElementById("name"),
    error: document.getElementById("nameError"),
    message: "Informe seu nome."
  },
  {
    input: document.getElementById("email"),
    error: document.getElementById("emailError"),
    message: "Informe um e-mail válido.",
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },
  {
    input: document.getElementById("subject"),
    error: document.getElementById("subjectError"),
    message: "Informe o assunto."
  },
  {
    input: document.getElementById("message"),
    error: document.getElementById("messageError"),
    message: "Escreva sua mensagem."
  }
];

function updateHeaderBackground() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 0);
}

if (menuBtn && navbar) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = navbar.contains(event.target);
    const clickedButton = menuBtn.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
      navbar.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

function validateField(field) {
  const value = field.input.value.trim();
  const isValid = value && (!field.validate || field.validate(value));

  field.input.classList.toggle("invalid", !isValid);
  field.error.textContent = isValid ? "" : field.message;

  return isValid;
}

if (contactForm) {
  fields.forEach((field) => {
    field.input.addEventListener("input", () => validateField(field));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = fields.every(validateField);

    if (!isValid) {
      feedback.textContent = "";
      return;
    }

    feedback.textContent = "Mensagem preparada com sucesso. Integre o envio ao backend futuramente.";
    contactForm.reset();
  });
}

window.addEventListener("scroll", updateHeaderBackground, { passive: true });
window.addEventListener("load", updateHeaderBackground);
updateHeaderBackground();
