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
const mapFilterButtons = document.querySelectorAll('[data-map-filter]');
const stationPins = document.querySelectorAll('[data-station]');
const stationSelect = document.querySelector('[data-station-select]');
const periodSelect = document.querySelector('[data-period-select]');
const stationLocation = document.querySelector('[data-station-location]');
const stationStatus = document.querySelector('[data-station-status]');
const stationUpdate = document.querySelector('[data-station-update]');
const stationEnergy = document.querySelector('[data-station-energy]');
const stationEfficiency = document.querySelector('[data-station-efficiency]');
const stationIntegrity = document.querySelector('[data-station-integrity]');
const stationTemp = document.querySelector('[data-station-temp]');
const activeStations = document.querySelector('[data-active-stations]');
const incidentCount = document.querySelector('[data-incident-count]');
const efficiency = document.querySelector('[data-efficiency]');
const energyLine = document.querySelector('[data-energy-line]');
const toast = document.querySelector('#monitorToast');

const stations = {
  'EN-01': {
    location: 'América Norte - 42,3° N',
    status: 'Ativa',
    update: 'Hoje, 14:32',
    energy: '1,36 TWH',
    efficiency: '96,4%',
    integrity: '94%',
    temp: '36°C',
    tone: 'success'
  },
  'EN-03': {
    location: 'América Sul - 15,8° S',
    status: 'Ativa',
    update: 'Hoje, 14:28',
    energy: '1,18 TWH',
    efficiency: '94,8%',
    integrity: '91%',
    temp: '34°C',
    tone: 'success'
  },
  'EN-04': {
    location: 'Atlântico Leste - 3,1° N',
    status: 'Manutenção',
    update: 'Hoje, 11:08',
    energy: '0,82 TWH',
    efficiency: '88,5%',
    integrity: '83%',
    temp: '39°C',
    tone: 'warning'
  },
  'EN-05': {
    location: 'Órbita GEO - 15,3° S',
    status: 'Alerta',
    update: 'Hoje, 14:32',
    energy: '1,24 TWH',
    efficiency: '89,2%',
    integrity: '78%',
    temp: '42°C',
    tone: 'danger'
  },
  'EN-07': {
    location: 'Ásia Oriental - 35,6° N',
    status: 'Ativa',
    update: 'Hoje, 14:30',
    energy: '1,52 TWH',
    efficiency: '97,1%',
    integrity: '96%',
    temp: '33°C',
    tone: 'success'
  },
  'EN-08': {
    location: 'Índico Sul - 24,4° S',
    status: 'Ativa',
    update: 'Hoje, 14:26',
    energy: '1,09 TWH',
    efficiency: '93,6%',
    integrity: '90%',
    temp: '37°C',
    tone: 'success'
  },
  'EN-09': {
    location: 'Cone Sul - 38,2° S',
    status: 'Inativa',
    update: 'Ontem, 22:15',
    energy: '0,12 TWH',
    efficiency: '41,7%',
    integrity: '58%',
    temp: '29°C',
    tone: 'warning'
  },
  'EN-10': {
    location: 'Oceania - 27,7° S',
    status: 'Planejada',
    update: 'Em implantação',
    energy: '0,00 TWH',
    efficiency: '0%',
    integrity: 'Projeto',
    temp: '--',
    tone: 'success'
  }
};

const periodSnapshots = {
  '31/05/2026 - 06/06/2026': {
    stations: '8',
    incidents: '2',
    efficiency: '95,1%',
    line: '1,31 15,27 29,28 43,35 57,26 71,20 85,21 99,25'
  },
  '24/05/2026 - 30/05/2026': {
    stations: '7',
    incidents: '3',
    efficiency: '92,4%',
    line: '1,34 15,31 29,29 43,32 57,30 71,24 85,27 99,23'
  },
  '01/06/2026 - 06/06/2026': {
    stations: '8',
    incidents: '1',
    efficiency: '96,0%',
    line: '1,30 15,27 29,34 43,26 57,22 71,18 85,20 99,19'
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
  closeModal(filtersModal);
}

function getPinKey(pin) {
  const stationId = pin.dataset.station || '';
  return stationId.replace(' GEO', '');
}

function setTone(element, tone) {
  if (!element) {
    return;
  }

  element.classList.remove('success-text', 'danger-text', 'warning-text');

  if (tone === 'danger') {
    element.classList.add('danger-text');
    return;
  }

  if (tone === 'warning') {
    element.classList.add('warning-text');
    return;
  }

  element.classList.add('success-text');
}

function selectStation(stationId, options = {}) {
  const station = stations[stationId] || stations['EN-01'];

  if (stationSelect && stationSelect.value !== stationId) {
    stationSelect.value = stationId;
  }

  stationPins.forEach((pin) => {
    pin.classList.toggle('is-selected', getPinKey(pin) === stationId);
  });

  if (stationLocation) stationLocation.textContent = station.location;
  if (stationStatus) stationStatus.textContent = station.status;
  if (stationUpdate) stationUpdate.textContent = station.update;
  if (stationEnergy) stationEnergy.textContent = station.energy;
  if (stationEfficiency) stationEfficiency.textContent = station.efficiency;
  if (stationIntegrity) stationIntegrity.textContent = station.integrity;
  if (stationTemp) stationTemp.textContent = station.temp;

  setTone(stationStatus, station.tone);
  if (!options.silent) {
    showToast(`Estação selecionada: ${stationId}.`);
  }
}

function filterMap(filter) {
  stationPins.forEach((pin) => {
    const isActive = pin.classList.contains('active');
    const isAlert = pin.classList.contains('alert');
    const shouldShow = filter === 'all' || (filter === 'active' && isActive) || (filter === 'alert' && isAlert);

    pin.hidden = !shouldShow;
  });

  closeModal(filtersModal);
  showToast(filter === 'all' ? 'Todas as estações exibidas.' : 'Filtro aplicado ao mapa.');
}

function updatePeriod(period) {
  const snapshot = periodSnapshots[period];

  if (!snapshot) {
    return;
  }

  if (activeStations) activeStations.textContent = snapshot.stations;
  if (incidentCount) incidentCount.textContent = snapshot.incidents;
  if (efficiency) efficiency.textContent = snapshot.efficiency;
  if (energyLine) energyLine.setAttribute('points', snapshot.line);

  showToast(`Período atualizado: ${period}.`);
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

stationPins.forEach((pin) => {
  pin.addEventListener('click', () => {
    selectStation(getPinKey(pin));
  });
});

if (stationSelect) {
  stationSelect.addEventListener('change', () => {
    selectStation(stationSelect.value);
  });
}

if (periodSelect) {
  periodSelect.addEventListener('change', () => {
    updatePeriod(periodSelect.value);
  });
}

mapFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterMap(button.dataset.mapFilter);
  });
});

selectStation('EN-01', { silent: true });
