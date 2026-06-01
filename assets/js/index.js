const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const header = document.querySelector(".header");
const cards = document.querySelectorAll(".solution-card");
const dotsContainer = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
let autoSlide;

const slides = [
  {
    image: "../../assets/images/Monitoramento-Img.png",
    title: "Monitoramento em tempo real",
    text: "Acompanhe operações, satélites e estações receptoras com alta precisão operacional."
  },
  {
    image: "../../assets/images/OtimizaçãoEnergetica-Img.png",
    title: "Otimização energética",
    text: "Otimize o fluxo de energia com dados em tempo real e inteligência analítica."
  },
  {
    image: "../../assets/images/EnergiaDoFuturo-Img.png",
    title: "Energia para o futuro",
    text: "Integração moderna para infraestrutura SBSP escalável, segura e sustentável."
  },
  {
    image: "../../assets/images/Alertas-Operacionais-Img.png",
    title: "Alertas operacionais",
    text: "Identifique anomalias e riscos com respostas rápidas e guiadas por dados."
  },
  {
    image: "../../assets/images/IA-Img.png",
    title: "Recomendações com IA",
    text: "Receba insights para decisões táticas e estratégicas em todo o ecossistema SBSP."
  },
  {
    image: "../../assets/images/Relatorios-Analitico-Img.png",
    title: "Relatórios analíticos",
    text: "Visualize históricos, indicadores e performance com visão executiva da operação."
  }
];

function updateHeaderBackground() {
  if (!header) return;
  if (window.scrollY === 0) {
    header.classList.remove("scrolled");
  } else {
    header.classList.add("scrolled");
  }
}

if (menuBtn && navbar) {
  menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = navbar.contains(event.target);
    const clickedButton = menuBtn.contains(event.target);
    if (!clickedInsideMenu && !clickedButton) {
      navbar.classList.remove("open");
    }
  });
}

function createDots() {
  if (!dotsContainer) return;
  const totalGroups = Math.ceil(slides.length / 3);
  dotsContainer.innerHTML = "";

  for (let index = 0; index < totalGroups; index++) {
    const dot = document.createElement("button");
    dot.classList.add("dot");
    dot.setAttribute("aria-label", `Ir para grupo ${index + 1}`);

    dot.addEventListener("click", () => {
      currentIndex = index * 3;
      updateCards();
      restartAutoSlide();
    });

    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  if (!dotsContainer) return;
  const dots = document.querySelectorAll(".dot");
  const activeDot = Math.floor(currentIndex / 3);

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === activeDot);
  });
}

function updateCards() {
  if (!cards.length) return;

  cards.forEach((card) => {
    card.classList.add("changing");
  });

  setTimeout(() => {
    cards.forEach((card, cardIndex) => {
      const slideIndex = (currentIndex + cardIndex) % slides.length;
      const slide = slides[slideIndex];

      const image = card.querySelector("img");
      const title = card.querySelector("h3");
      const text = card.querySelector("p");

      image.src = slide.image;
      image.alt = slide.title;
      image.classList.toggle("centered-image", slide.title === "Otimização energética");
      title.textContent = slide.title;
      text.textContent = slide.text;

      card.classList.remove("changing");
      card.classList.toggle("active-mobile", cardIndex === 0);
    });

    updateDots();
  }, 260);
}

function nextSlide() {
  currentIndex += 3;
  if (currentIndex >= slides.length) {
    currentIndex = 0;
  }
  updateCards();
}

function prevSlide() {
  currentIndex -= 3;
  if (currentIndex < 0) {
    currentIndex = slides.length - 3;
  }
  updateCards();
}

function restartAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(nextSlide, 5500);
}

window.addEventListener("scroll", updateHeaderBackground, { passive: true });
window.addEventListener("load", updateHeaderBackground);
updateHeaderBackground();

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    nextSlide();
    restartAutoSlide();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    prevSlide();
    restartAutoSlide();
  });
}

createDots();
updateCards();
if (cards.length) {
  restartAutoSlide();
}

const dashboardImage = document.querySelector(".about-media img");
if (dashboardImage) {
  dashboardImage.addEventListener("error", () => {
    dashboardImage.src = "../../assets/images/Bg-Index2.png";
    dashboardImage.alt = "Visual alternativo da plataforma Prepila Dyson";
  });
}