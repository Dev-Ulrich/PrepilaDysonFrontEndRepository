const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const detailsModal = document.querySelector('#detailsModal');
const closeDetailsButton = document.querySelector('[data-close-details]');
const detailsSubtitle = document.querySelector('[data-details-subtitle]');
const detailTitle = document.querySelector('[data-detail-title]');
const detailCopy = document.querySelector('[data-detail-copy]');
const searchInput = document.querySelector('[data-recommendation-search]');
const filterButton = document.querySelector('[data-cycle-filter]');
const recommendationCards = document.querySelectorAll('[data-recommendation-card]');
const actionButtons = document.querySelectorAll('[data-action]');
const detailsButtons = document.querySelectorAll('[data-open-details]');
const modalActionButtons = document.querySelectorAll('[data-modal-action]');
const historyButtons = document.querySelectorAll('[data-history-view]');
const periodSelect = document.querySelector('[data-period-select]');
const appliedCount = document.querySelector('[data-applied-count]');
const pendingCount = document.querySelector('[data-pending-count]');
const dismissedCount = document.querySelector('[data-dismissed-count]');
const visibleCount = document.querySelector('[data-visible-count]');
const toast = document.querySelector('#recommendationsToast');

const filters = ['todas', 'alta', 'media', 'baixa', 'pendente', 'aplicada', 'descartada'];
let filterIndex = 0;
let selectedCard = null;

function setSidebarState(isOpen) {
  document.body.classList.toggle('sidebar-open', isOpen);

  if (sidebarToggle) {
    sidebarToggle.setAttribute('aria-expanded', String(isOpen));
  }
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.hidden = false;

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function openModal(modal, focusTarget) {
  if (!modal) {
    return;
  }

  modal.hidden = false;
  document.body.classList.add('modal-open');
  focusTarget?.focus();
}

function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.hidden = true;
  document.body.classList.remove('modal-open');
}

function closeAllModals() {
  closeModal(notificationModal);
  closeModal(detailsModal);
}

function normalize(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getCardTitle(card) {
  return card?.dataset.title || 'recomendação selecionada';
}

function updateCounters() {
  const cards = Array.from(recommendationCards);
  const applied = cards.filter((card) => card.dataset.status === 'aplicada').length;
  const dismissed = cards.filter((card) => card.dataset.status === 'descartada').length;
  const pending = cards.filter((card) => card.dataset.status === 'pendente').length;

  if (appliedCount) appliedCount.textContent = String(17 + applied);
  if (dismissedCount) dismissedCount.textContent = String(5 + dismissed);
  if (pendingCount) pendingCount.textContent = String(Math.max(0, 6 - applied - dismissed));
}

function filterRecommendations() {
  const activeFilter = filters[filterIndex];
  const query = normalize(searchInput ? searchInput.value.trim() : '');
  let shown = 0;

  recommendationCards.forEach((card) => {
    const text = normalize(card.textContent);
    const matchesSearch = text.includes(query);
    const matchesPriority = ['alta', 'media', 'baixa'].includes(activeFilter) && card.dataset.priority === activeFilter;
    const matchesStatus = ['pendente', 'aplicada', 'descartada'].includes(activeFilter) && card.dataset.status === activeFilter;
    const matchesFilter = activeFilter === 'todas' || matchesPriority || matchesStatus;
    const isVisible = matchesSearch && matchesFilter;

    card.hidden = !isVisible;

    if (isVisible) {
      shown += 1;
    }
  });

  if (visibleCount) {
    visibleCount.textContent = `Exibindo ${shown} recomendações em destaque de 28 recomendações`;
  }
}

function setCardStatus(card, status) {
  if (!card) {
    return;
  }

  card.dataset.status = status;
  card.classList.toggle('is-applied', status === 'aplicada');
  card.classList.toggle('is-dismissed', status === 'descartada');

  const buttons = card.querySelectorAll('[data-action]');
  buttons.forEach((button) => {
    button.disabled = status !== 'pendente';
  });

  updateCounters();
  filterRecommendations();
}

function openDetails(card) {
  selectedCard = card;
  const title = getCardTitle(card);
  const status = card?.dataset.status || 'pendente';
  const priority = card?.dataset.priority || 'nao informada';

  if (detailsSubtitle) {
    detailsSubtitle.textContent = `Recomendação selecionada: ${title}.`;
  }

  if (detailTitle) {
    detailTitle.textContent = title;
  }

  if (detailCopy) {
    detailCopy.textContent = `Prioridade ${priority}, status ${status}. Revise impacto esperado, ativo relacionado e fonte antes de executar a ação.`;
  }

  openModal(detailsModal, closeDetailsButton);
}

function handleAction(card, action) {
  const title = getCardTitle(card);

  if (action === 'aplicar') {
    setCardStatus(card, 'aplicada');
    showToast(`Recomendação aplicada: ${title}.`);
    return;
  }

  if (action === 'descartar') {
    setCardStatus(card, 'descartada');
    showToast(`Recomendação descartada: ${title}.`);
  }
}

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    setSidebarState(!document.body.classList.contains('sidebar-open'));
  });
}

if (sidebarBackdrop) {
  sidebarBackdrop.addEventListener('click', () => {
    setSidebarState(false);
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSidebarState(false);
    closeAllModals();
  }
});

if (notificationButton) {
  notificationButton.addEventListener('click', () => {
    openModal(notificationModal, closeNotificationButton);
  });
}

if (closeNotificationButton) {
  closeNotificationButton.addEventListener('click', () => {
    closeModal(notificationModal);
  });
}

if (readNotificationButton) {
  readNotificationButton.addEventListener('click', () => {
    if (notificationCount) {
      notificationCount.textContent = '0';
      notificationCount.classList.add('is-read');
    }

    readNotificationButton.textContent = '✓✓ Lido';
    closeModal(notificationModal);
  });
}

if (closeDetailsButton) {
  closeDetailsButton.addEventListener('click', () => {
    closeModal(detailsModal);
  });
}

[notificationModal, detailsModal].forEach((modal) => {
  if (!modal) {
    return;
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

if (filterButton) {
  filterButton.addEventListener('click', () => {
    filterIndex = (filterIndex + 1) % filters.length;
    filterButton.textContent = `▾ Filtrar: ${filters[filterIndex]}`;
    filterRecommendations();
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterRecommendations);
}

if (periodSelect) {
  periodSelect.addEventListener('change', () => {
    showToast(`Período atualizado: ${periodSelect.value}.`);
  });
}

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleAction(button.closest('[data-recommendation-card]'), button.dataset.action);
  });
});

detailsButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openDetails(button.closest('[data-recommendation-card]'));
  });
});

modalActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.modalAction;

    if (!selectedCard) {
      showToast('Nenhuma recomendação selecionada.');
      return;
    }

    if (action === 'agendar') {
      showToast(`Execução agendada: ${getCardTitle(selectedCard)}.`);
      closeModal(detailsModal);
      return;
    }

    handleAction(selectedCard, action);
    closeModal(detailsModal);
  });
});

historyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const row = button.closest('.history-row');
    const title = row ? row.querySelector('[role="cell"]')?.textContent.trim() : 'histórico selecionado';

    showToast(`Histórico aberto: ${title}.`);
  });
});

updateCounters();
filterRecommendations();
