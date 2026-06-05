const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const preferencesButton = document.querySelector('[data-open-preferences]');
const preferencesModal = document.querySelector('#preferencesModal');
const closePreferencesButton = document.querySelector('[data-close-preferences]');
const preferenceButtons = document.querySelectorAll('[data-preference]');
const periodButtons = document.querySelectorAll('[data-period]');
const grainSelect = document.querySelector('[data-chart-grain]');
const exportButtons = document.querySelectorAll('[data-export]');
const stationActionButtons = document.querySelectorAll('[data-station-action]');
const stationRows = document.querySelectorAll('[data-station-row]');
const stationActionsModal = document.querySelector('#stationActionsModal');
const closeStationActionsButton = document.querySelector('[data-close-station-actions]');
const stationActionsSubtitle = document.querySelector('#stationActionsSubtitle');
const stationModalActionButtons = document.querySelectorAll('[data-station-modal-action]');
const tableOptionsButton = document.querySelector('[data-open-table-options]');
const tableOptionsModal = document.querySelector('#tableOptionsModal');
const closeTableOptionsButton = document.querySelector('[data-close-table-options]');
const tableActionButtons = document.querySelectorAll('[data-table-action]');
const toast = document.querySelector('#reportsToast');

let selectedStation = '';

const periodData = {
  mes: {
    total: '12,4 TWH',
    efficiency: '95,1%',
    sent: '11,8 TWH',
    received: '11,3 TWH',
    trends: {
      total: '↑ 11,3% <span>vs mês anterior</span>',
      efficiency: '↑ 2,7% <span>vs mês anterior</span>',
      sent: '↑ 10,8% <span>vs mês anterior</span>',
      received: '↑ 9,6% <span>vs mês anterior</span>'
    },
    summary: {
      operations: '42',
      stations: '8',
      satellites: '12',
      alerts: '7',
      maintenance: '5'
    }
  },
  trimestre: {
    total: '35,7 TWH',
    efficiency: '94,4%',
    sent: '33,9 TWH',
    received: '32,8 TWH',
    trends: {
      total: '↑ 8,1% <span>vs trimestre anterior</span>',
      efficiency: '↑ 1,9% <span>vs trimestre anterior</span>',
      sent: '↑ 7,6% <span>vs trimestre anterior</span>',
      received: '↑ 6,8% <span>vs trimestre anterior</span>'
    },
    summary: {
      operations: '126',
      stations: '8',
      satellites: '14',
      alerts: '18',
      maintenance: '11'
    }
  },
  ano: {
    total: '146,2 TWH',
    efficiency: '93,8%',
    sent: '139,4 TWH',
    received: '134,7 TWH',
    trends: {
      total: '↑ 16,4% <span>vs ano anterior</span>',
      efficiency: '↑ 4,3% <span>vs ano anterior</span>',
      sent: '↑ 15,1% <span>vs ano anterior</span>',
      received: '↑ 14,7% <span>vs ano anterior</span>'
    },
    summary: {
      operations: '512',
      stations: '9',
      satellites: '18',
      alerts: '61',
      maintenance: '34'
    }
  }
};

const chartLines = {
  diario: {
    energy: '2,43 10,39 18,34 26,27 34,31 42,24 50,31 58,16 66,9 74,19 82,33 90,27 98,20',
    efficiency: '2,53 10,50 18,47 26,43 34,46 42,41 50,45 58,34 66,27 74,37 82,47 90,44 98,39'
  },
  semanal: {
    energy: '2,45 14,31 26,38 38,24 50,18 62,27 74,16 86,28 98,20',
    efficiency: '2,52 14,46 26,48 38,39 50,32 62,38 74,30 86,42 98,35'
  },
  mensal: {
    energy: '2,48 18,36 34,29 50,18 66,24 82,16 98,12',
    efficiency: '2,54 18,48 34,42 50,34 66,39 82,31 98,27'
  }
};

const loggedUser = {
  username: 'admPrepilaDyson',
  displayName: 'Administrador Prepila Dyson',
  loggedAt: new Date().toISOString()
};

sessionStorage.setItem('prepila-auth-user', JSON.stringify(loggedUser));

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
  closeModal(preferencesModal);
  closeModal(tableOptionsModal);
  closeModal(stationActionsModal);
}

function updatePeriod(period) {
  const data = periodData[period] || periodData.mes;

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'trends' || key === 'summary') {
      return;
    }

    const metric = document.querySelector(`[data-metric="${key}"]`);

    if (metric) {
      metric.textContent = value;
    }
  });

  Object.entries(data.trends).forEach(([key, value]) => {
    const trend = document.querySelector(`[data-metric-trend="${key}"]`);

    if (trend) {
      trend.innerHTML = value;
    }
  });

  Object.entries(data.summary).forEach(([key, value]) => {
    const summaryItem = document.querySelector(`[data-summary="${key}"]`);

    if (summaryItem) {
      summaryItem.textContent = value;
    }
  });
}

function updateChart(grain) {
  const lines = chartLines[grain] || chartLines.diario;
  const energyLine = document.querySelector('.energy-line');
  const efficiencyLine = document.querySelector('.efficiency-line');

  if (energyLine) {
    energyLine.setAttribute('points', lines.energy);
  }

  if (efficiencyLine) {
    efficiencyLine.setAttribute('points', lines.efficiency);
  }
}

function highlightStation(stationName) {
  stationRows.forEach((row) => {
    row.classList.toggle('is-highlighted', row.dataset.station === stationName);
  });
}

function openStationActionsModal(stationName) {
  selectedStation = stationName;
  highlightStation(stationName);

  if (stationActionsSubtitle) {
    stationActionsSubtitle.textContent = `Estação selecionada: ${stationName}.`;
  }

  openModal(stationActionsModal, closeStationActionsButton);
}

function handleStationModalAction(action) {
  if (!selectedStation) {
    showToast('Nenhuma estação selecionada.');
    return;
  }

  const messages = {
    detalhes: `Detalhes da estação ${selectedStation} carregados.`,
    comparar: `Comparativo da estação ${selectedStation} preparado.`,
    historico: `Histórico operacional da estação ${selectedStation} aberto.`,
    exportar: `Dados da estação ${selectedStation} exportados com sucesso.`,
    alerta: `Alerta operacional criado para ${selectedStation}.`,
    manutencao: `Manutenção agendada para ${selectedStation}.`
  };

  showToast(messages[action] || `Ação executada para ${selectedStation}.`);
  closeModal(stationActionsModal);
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

if (preferencesButton) {
  preferencesButton.addEventListener('click', () => {
    openModal(preferencesModal, closePreferencesButton);
  });
}

if (closePreferencesButton) {
  closePreferencesButton.addEventListener('click', () => {
    closeModal(preferencesModal);
  });
}

if (tableOptionsButton) {
  tableOptionsButton.addEventListener('click', () => {
    openModal(tableOptionsModal, closeTableOptionsButton);
  });
}

if (closeTableOptionsButton) {
  closeTableOptionsButton.addEventListener('click', () => {
    closeModal(tableOptionsModal);
  });
}

if (closeStationActionsButton) {
  closeStationActionsButton.addEventListener('click', () => {
    closeModal(stationActionsModal);
  });
}

[notificationModal, preferencesModal, tableOptionsModal, stationActionsModal].forEach((modal) => {
  if (!modal) {
    return;
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

periodButtons.forEach((button) => {
  button.addEventListener('click', () => {
    periodButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    updatePeriod(button.dataset.period);
    showToast(`Período atualizado: ${button.textContent.trim()}.`);
  });
});

if (grainSelect) {
  grainSelect.addEventListener('change', () => {
    updateChart(grainSelect.value);
    showToast(`Comparativo agrupado por ${grainSelect.options[grainSelect.selectedIndex].text.toLowerCase()}.`);
  });
}

exportButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(`Relatório ${button.dataset.export.toUpperCase()} exportado com sucesso.`);
  });
});

stationActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openStationActionsModal(button.dataset.stationAction);
  });
});

stationModalActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    handleStationModalAction(button.dataset.stationModalAction);
  });
});

preferenceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.preference);
    closeModal(preferencesModal);
  });
});

tableActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.tableAction);
    closeModal(tableOptionsModal);
  });
});

updatePeriod('mes');
updateChart('diario');