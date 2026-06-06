const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const settingsButton = document.querySelector('[data-open-settings]');
const settingsModal = document.querySelector('#settingsModal');
const closeSettingsButton = document.querySelector('[data-close-settings]');
const settingsActionButtons = document.querySelectorAll('[data-settings-action]');
const alertDetailsModal = document.querySelector('#alertDetailsModal');
const closeAlertDetailsButton = document.querySelector('[data-close-alert-details]');
const alertDetailsSubtitle = document.querySelector('#alertDetailsSubtitle');
const detailName = document.querySelector('[data-detail-name]');
const detailDescription = document.querySelector('[data-detail-description]');
const alertModalActionButtons = document.querySelectorAll('[data-alert-modal-action]');
const priorityButtons = document.querySelectorAll('[data-filter-priority]');
const statusFilterButton = document.querySelector('[data-cycle-status]');
const searchInput = document.querySelector('[data-alert-search]');
const alertRows = document.querySelectorAll('[data-alert-row]');
const topAlerts = document.querySelectorAll('[data-top-alert]');
const viewAlertButtons = document.querySelectorAll('[data-view-alert]');
const alertActionButtons = document.querySelectorAll('[data-alert-actions]');
const detailTopButtons = document.querySelectorAll('[data-open-alert]');
const quickActionButtons = document.querySelectorAll('[data-quick-action]');
const alertCount = document.querySelector('[data-alert-count]');
const pagination = document.querySelector('.pagination');
const toast = document.querySelector('#alertsToast');

let activePriority = 'todos';
let activeStatus = 'todos';
let selectedAlert = '';
let currentPage = 1;
const pageSize = 5;

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
  closeModal(settingsModal);
  closeModal(alertDetailsModal);
}

function getAlertNameFromButton(button) {
  const row = button.closest('[data-alert-row]');

  if (row) {
    return row.dataset.alertName;
  }

  return button.dataset.openAlert || selectedAlert;
}

function getSelectedAlertRow() {
  return Array.from(alertRows).find((row) => row.dataset.alertName === selectedAlert);
}

function highlightAlert(alertName) {
  alertRows.forEach((row) => {
    row.classList.toggle('is-highlighted', row.dataset.alertName === alertName);
  });
}

function openAlertDetails(alertName) {
  selectedAlert = alertName;
  highlightAlert(alertName);

  if (alertDetailsSubtitle) {
    alertDetailsSubtitle.textContent = `Alerta selecionado: ${alertName}.`;
  }

  if (detailName) {
    detailName.textContent = alertName;
  }

  if (detailDescription) {
    detailDescription.textContent = 'Revise prioridade, categoria, status e recomendação operacional antes de executar uma ação.';
  }

  openModal(alertDetailsModal, closeAlertDetailsButton);
}

function updateAlertRowStatus(row, status) {
  const statusLabel = row.querySelector('.status');

  row.dataset.status = status;

  if (!statusLabel) {
    return;
  }

  if (status === 'resolvido') {
    statusLabel.className = 'status resolved';
    statusLabel.textContent = '● Resolvido';
    return;
  }

  if (status === 'pendente') {
    statusLabel.className = 'status pending';
    statusLabel.textContent = '● Pendente';
    return;
  }

  statusLabel.className = 'status active';
  statusLabel.textContent = '● Ativo';
}

function handleAlertModalAction(action) {
  const row = getSelectedAlertRow();

  if (!selectedAlert) {
    showToast('Nenhum alerta selecionado.');
    return;
  }

  if (action === 'aplicar' && row) {
    updateAlertRowStatus(row, 'resolvido');
    showToast(`Recomendação aplicada: ${selectedAlert}.`);
    closeModal(alertDetailsModal);
    filterAlerts();
    return;
  }

  if (action === 'descartar' && row) {
    updateAlertRowStatus(row, 'pendente');
    showToast(`Alerta descartado para revisão: ${selectedAlert}.`);
    closeModal(alertDetailsModal);
    filterAlerts();
    return;
  }

  if (action === 'atribuir') {
    showToast(`Responsável atribuído ao alerta: ${selectedAlert}.`);
    closeModal(alertDetailsModal);
  }
}

function filterAlerts() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const matchingRows = [];

  alertRows.forEach((row) => {
    const matchesSearch = row.textContent.toLowerCase().includes(query);
    const matchesPriority = activePriority === 'todos' || row.dataset.priority === activePriority;
    const matchesStatus = activeStatus === 'todos' || row.dataset.status === activeStatus;
    if (matchesSearch && matchesPriority && matchesStatus) matchingRows.push(row);
  });

  const totalPages = Math.max(1, Math.ceil(matchingRows.length / pageSize));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageRows = matchingRows.slice(start, start + pageSize);

  alertRows.forEach((row) => {
    row.hidden = !pageRows.includes(row);
  });

  topAlerts.forEach((card) => {
    const matchesSearch = card.textContent.toLowerCase().includes(query);
    const matchesPriority = activePriority === 'todos' || card.dataset.priority === activePriority;

    card.hidden = !(matchesSearch && matchesPriority);
  });

  if (alertCount) {
    const first = matchingRows.length ? start + 1 : 0;
    const last = Math.min(start + pageSize, matchingRows.length);
    alertCount.textContent = `Exibindo ${first} a ${last} de ${matchingRows.length} alertas`;
  }

  if (pagination) {
    pagination.innerHTML = `
      <button type="button" data-alert-page="prev" ${currentPage === 1 ? 'disabled' : ''}>‹</button>
      ${Array.from({ length: totalPages }, (_, index) => `<button class="${index + 1 === currentPage ? 'active' : ''}" type="button" data-alert-page="${index + 1}">${index + 1}</button>`).join('')}
      <button type="button" data-alert-page="next" ${currentPage === totalPages ? 'disabled' : ''}>›</button>
    `;
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

if (settingsButton) {
  settingsButton.addEventListener('click', () => {
    openModal(settingsModal, closeSettingsButton);
  });
}

if (closeSettingsButton) {
  closeSettingsButton.addEventListener('click', () => {
    closeModal(settingsModal);
  });
}

if (closeAlertDetailsButton) {
  closeAlertDetailsButton.addEventListener('click', () => {
    closeModal(alertDetailsModal);
  });
}

[notificationModal, settingsModal, alertDetailsModal].forEach((modal) => {
  if (!modal) {
    return;
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

priorityButtons.forEach((button) => {
  button.addEventListener('click', () => {
    priorityButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    activePriority = button.dataset.filterPriority;
    currentPage = 1;
    filterAlerts();
    showToast(`Filtro aplicado: ${button.textContent.trim()}.`);
  });
});

if (statusFilterButton) {
  statusFilterButton.addEventListener('click', () => {
    const nextStatus = {
      todos: 'ativo',
      ativo: 'pendente',
      pendente: 'resolvido',
      resolvido: 'todos'
    };

    activeStatus = nextStatus[activeStatus];
    statusFilterButton.textContent = `🔎 Filtros: ${activeStatus}`;
    currentPage = 1;
    filterAlerts();
  });
}

if (searchInput) {
  searchInput.addEventListener('input', () => {
    currentPage = 1;
    filterAlerts();
  });
}

viewAlertButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openAlertDetails(getAlertNameFromButton(button));
  });
});

alertActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openAlertDetails(getAlertNameFromButton(button));
  });
});

detailTopButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openAlertDetails(button.dataset.openAlert);
  });
});

quickActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('[data-top-alert]');
    const alertName = card ? card.dataset.alertName : 'alerta selecionado';
    const action = button.dataset.quickAction === 'aplicar' ? 'aplicado' : 'descartado';

    showToast(`Alerta ${action}: ${alertName}.`);
  });
});

settingsActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.settingsAction?.includes('exportado') && window.PrepilaData) {
      PrepilaData.downloadFile('relatorio-alertas.json', JSON.stringify(Array.from(alertRows).map((row) => ({
        name: row.dataset.alertName,
        status: row.dataset.status,
        priority: row.dataset.priority,
      })), null, 2));
    }
    showToast(button.dataset.settingsAction);
    closeModal(settingsModal);
  });
});

alertModalActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleAlertModalAction(button.dataset.alertModalAction);
  });
});

if (pagination) {
  pagination.addEventListener('click', (event) => {
    const button = event.target.closest('[data-alert-page]');
    if (!button || button.disabled) return;
    const action = button.dataset.alertPage;
    if (action === 'prev') currentPage = Math.max(1, currentPage - 1);
    else if (action === 'next') currentPage += 1;
    else currentPage = Number(action);
    filterAlerts();
  });
}

filterAlerts();
