const menuBtn = document.getElementById('menuBtn');
const navbar = document.getElementById('navbar');

const cards = document.querySelectorAll('.solution-card');
const dotsContainer = document.getElementById('dots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let autoSlide;

const slides = [
  {
    image: '../../assets/images/slide-monitoramento.jpg',
    title: 'Monitoramento em tempo real',
    text: 'Acompanhe operações, satélites e estações receptoras com precisão.'
  },
  {
    image: '../../assets/images/slide-otimizacao.jpg',
    title: 'Otimização energética',
    text: 'Controle o fluxo de energia solar espacial com dados inteligentes.'
  },
  {
    image: '../../assets/images/slide-futuro.jpg',
    title: 'Energia para o futuro',
    text: 'Uma camada de gestão para infraestruturas SBSP modernas.'
  },
  {
    image: '../../assets/images/slide-alertas.jpg',
    title: 'Alertas operacionais',
    text: 'Identifique anomalias, falhas e riscos com resposta rápida.'
  },
  {
    image: '../../assets/images/slide-ia.jpg',
    title: 'Recomendações com IA',
    text: 'Apoio inteligente para melhorar eficiência e tomada de decisão.'
  },
  {
    image: '../../assets/images/slide-analytics.jpg',
    title: 'Relatórios analíticos',
    text: 'Visualize históricos, indicadores e desempenho da operação.'
  }
];

function toggleMenu() {
  navbar.classList.toggle('open');
}

function createDots() {
  const totalGroups = Math.ceil(slides.length / 3);

  dotsContainer.innerHTML = '';

  for (let index = 0; index < totalGroups; index++) {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Ir para grupo ${index + 1}`);

    dot.addEventListener('click', () => {
      currentIndex = index * 3;
      updateCards();
      restartAutoSlide();
    });

    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  const activeDot = Math.floor(currentIndex / 3);

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === activeDot);
  });
}

function updateCards() {
  cards.forEach((card) => {
    card.classList.add('changing');
  });

  setTimeout(() => {
    cards.forEach((card, cardIndex) => {
      const slideIndex = (currentIndex + cardIndex) % slides.length;
      const slide = slides[slideIndex];

      const image = card.querySelector('img');
      const title = card.querySelector('h3');
      const text = card.querySelector('p');

      image.src = slide.image;
      image.alt = slide.title;
      title.textContent = slide.title;
      text.textContent = slide.text;

      card.classList.remove('changing');
      card.classList.toggle('active-mobile', cardIndex === 0);
    });

    updateDots();
  }, 300);
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
  autoSlide = setInterval(nextSlide, 5000);
}

menuBtn.addEventListener('click', toggleMenu);

nextBtn.addEventListener('click', () => {
  nextSlide();
  restartAutoSlide();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  restartAutoSlide();
});

createDots();
updateCards();
restartAutoSlide();

// Header background toggle on scroll
(function () {
  const headerEl = document.querySelector('.header');

  function updateHeaderBackground() {
    if (!headerEl) return;
    if (window.scrollY === 0) {
      headerEl.classList.remove('scrolled');
    } else {
      headerEl.classList.add('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeaderBackground, { passive: true });
  window.addEventListener('load', updateHeaderBackground);
  // initial check
  updateHeaderBackground();
})();