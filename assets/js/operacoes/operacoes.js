const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const filtersButton = document.querySelector('[data-open-filters]');
const filtersModal = document.querySelector('#filtersModal');
const closeFiltersButton = document.querySelector('[data-close-filters]');
const statusFilterButtons = document.querySelectorAll('[data-status-filter]');
const periodSelect = document.querySelector('[data-period-select]');
const chartPeriodSelect = document.querySelector('[data-chart-period]');
const windowSelect = document.querySelector('[data-window-select]');
const activeOperations = document.querySelector('[data-active-operations]');
const occurrenceCount = document.querySelector('[data-occurrence-count]');
const efficiency = document.querySelector('[data-efficiency]');
const energyLine = document.querySelector('[data-energy-line]');
const queueRows = document.querySelectorAll('[data-operation-row]');
const tableRows = document.querySelectorAll('[data-table-row]');
const rowActionButtons = document.querySelectorAll('[data-row-action]');
const toast = document.querySelector('#operationsToast');

const periodSnapshots = {
  '31/05/2026 - 06/06/2026': {
    operations: '42',
    occurrences: '5',
    efficiency: '95,1%',
    line: '1,30 15,28 29,21 43,26 57,20 71,19 85,16 99,18'
  },
  '24/05/2026 - 30/05/2026': {
    operations: '38',
    occurrences: '7',
    efficiency: '92,8%',
    line: '1,34 15,29 29,31 43,27 57,25 71,23 85,26 99,22'
  },
  '01/06/2026 - 06/06/2026': {
    operations: '44',
    occurrences: '4',
    efficiency: '96,0%',
    line: '1,32 15,25 29,22 43,24 57,18 71,17 85,15 99,16'
  }
};

const chartSnapshots = {
  'Últimos 7 dias': '1,30 15,28 29,21 43,26 57,20 71,19 85,16 99,18',
  'Últimas 24 horas': '1,36 15,33 29,29 43,24 57,21 71,23 85,18 99,20',
  'Últimos 30 dias': '1,38 15,34 29,30 43,28 57,24 71,20 85,18 99,14'
};

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
  closeModal(filtersModal);
}

function filterOperations(status) {
  [...queueRows, ...tableRows].forEach((row) => {
    row.hidden = status !== 'todos' && row.dataset.status !== status;
  });

  closeModal(filtersModal);
  showToast(status === 'todos' ? 'Todas as operações exibidas.' : `Filtro aplicado: ${status}.`);
}

function updatePeriod(period) {
  const snapshot = periodSnapshots[period];

  if (!snapshot) {
    return;
  }

  if (activeOperations) activeOperations.textContent = snapshot.operations;
  if (occurrenceCount) occurrenceCount.textContent = snapshot.occurrences;
  if (efficiency) efficiency.textContent = snapshot.efficiency;
  if (energyLine) energyLine.setAttribute('points', snapshot.line);

  showToast(`Período atualizado: ${period}.`);
}

function updateChartPeriod(period) {
  const points = chartSnapshots[period];

  if (energyLine && points) {
    energyLine.setAttribute('points', points);
  }

  showToast(`Gráfico atualizado: ${period}.`);
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

if (filtersButton) {
  filtersButton.addEventListener('click', () => {
    openModal(filtersModal, closeFiltersButton);
  });
}

if (closeFiltersButton) {
  closeFiltersButton.addEventListener('click', () => {
    closeModal(filtersModal);
  });
}

[notificationModal, filtersModal].forEach((modal) => {
  if (!modal) {
    return;
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

statusFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterOperations(button.dataset.statusFilter);
  });
});

if (periodSelect) {
  periodSelect.addEventListener('change', () => {
    updatePeriod(periodSelect.value);
  });
}

if (chartPeriodSelect) {
  chartPeriodSelect.addEventListener('change', () => {
    updateChartPeriod(chartPeriodSelect.value);
  });
}

if (windowSelect) {
  windowSelect.addEventListener('change', () => {
    showToast(`Mapa atualizado: ${windowSelect.value}.`);
  });
}

rowActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const row = button.closest('[data-table-row]');
    const operationName = row?.querySelector('span')?.textContent?.trim() || 'operação';

    showToast(`Ações abertas para ${operationName}.`);
  });
});
