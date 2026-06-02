const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const header = document.querySelector(".header");
const faqItems = document.querySelectorAll(".faq-item");

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

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  if (!button || !answer) return;

  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");

    button.setAttribute("aria-expanded", String(isOpen));
    answer.style.maxHeight = isOpen ? `${answer.scrollHeight}px` : "0";
  });
});

window.addEventListener("scroll", updateHeaderBackground, { passive: true });
window.addEventListener("load", updateHeaderBackground);
updateHeaderBackground();
