const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const refreshButton = document.querySelector('[data-refresh-dashboard]');
const periodButtons = document.querySelectorAll('[data-period]');
const actionsButton = document.querySelector('[data-open-actions]');
const actionsModal = document.querySelector('#actionsModal');
const closeActionsButton = document.querySelector('[data-close-actions]');
const actionButtons = document.querySelectorAll('[data-action]');
const activeAlerts = document.querySelector('[data-active-alerts]');
const captureLine = document.querySelector('.capture-line');
const transmissionLine = document.querySelector('.transmission-line');
const toast = document.querySelector('#dashboardToast');

const chartPoints = {
  '24h': {
    capture: '2,43 10,38 18,32 26,34 34,24 42,28 50,18 58,12 66,17 74,26 82,21 90,16 98,12',
    transmission: '2,49 10,44 18,40 26,42 34,31 42,35 50,26 58,21 66,25 74,33 82,28 90,24 98,20'
  },
  '7d': {
    capture: '2,46 12,39 22,35 32,26 42,31 52,20 62,14 72,19 82,13 92,18 98,15',
    transmission: '2,52 12,46 22,42 32,35 42,39 52,29 62,24 72,28 82,21 92,25 98,23'
  },
  '30d': {
    capture: '2,50 14,44 26,38 38,32 50,25 62,18 74,21 86,14 98,10',
    transmission: '2,55 14,49 26,45 38,39 50,34 62,27 74,30 86,23 98,19'
  }
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
  closeModal(actionsModal);
}

function updateChart(period) {
  const points = chartPoints[period] || chartPoints['24h'];

  if (captureLine) {
    captureLine.setAttribute('points', points.capture);
  }

  if (transmissionLine) {
    transmissionLine.setAttribute('points', points.transmission);
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

if (refreshButton) {
  refreshButton.addEventListener('click', () => {
    if (activeAlerts && window.PrepilaData) {
      activeAlerts.textContent = String(Math.max(3, PrepilaData.getAlerts().length || 7));
    } else if (activeAlerts) {
      activeAlerts.textContent = activeAlerts.textContent === '7' ? '6' : '7';
    }

    showToast('Dashboard atualizado com os dados mais recentes.');
  });
}

periodButtons.forEach((button) => {
  button.addEventListener('click', () => {
    periodButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    updateChart(button.dataset.period);
    showToast(`Período atualizado: ${button.dataset.period}.`);
  });
});

if (actionsButton) {
  actionsButton.addEventListener('click', () => {
    openModal(actionsModal, closeActionsButton);
  });
}

if (closeActionsButton) {
  closeActionsButton.addEventListener('click', () => {
    closeModal(actionsModal);
  });
}

[notificationModal, actionsModal].forEach((modal) => {
  if (!modal) {
    return;
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action || '';
    if (action.includes('exportado') && window.PrepilaData) {
      PrepilaData.downloadFile('dashboard-operacional.json', JSON.stringify({
        alerts: PrepilaData.getAlerts(),
        operations: PrepilaData.getOperations(),
        contracts: PrepilaData.getContracts(),
      }, null, 2));
    }
    if (action.includes('críticos')) {
      document.querySelectorAll('.alert-item, .timeline-item').forEach((item) => {
        item.classList.toggle('is-highlighted', item.textContent.toLowerCase().includes('crític') || item.textContent.toLowerCase().includes('alerta'));
      });
    }
    showToast(button.dataset.action);
    closeModal(actionsModal);
  });
});

updateChart('24h');
