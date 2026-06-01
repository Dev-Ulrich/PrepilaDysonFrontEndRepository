const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const header = document.querySelector(".header");

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

window.addEventListener("scroll", updateHeaderBackground, { passive: true });
window.addEventListener("load", updateHeaderBackground);
updateHeaderBackground();
