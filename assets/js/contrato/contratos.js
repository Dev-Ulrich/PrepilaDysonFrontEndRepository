const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const copyButtons = document.querySelectorAll('[data-copy]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const searchInput = document.querySelector('.contract-search-input');
const contractRows = document.querySelectorAll('[data-contract-row]');
const filterButton = document.querySelector('[data-filter-contracts]');
const exportReportButton = document.querySelector('[data-export-report]');
const actionButtons = document.querySelectorAll('[data-action]');
const detailButtons = document.querySelectorAll('[data-detail-contract]');
const toast = document.querySelector('#contractsToast');
const tableOptionsButton = document.querySelector('[data-open-table-options]');
const tableOptionsModal = document.querySelector('#tableOptionsModal');
const closeTableOptionsButton = document.querySelector('[data-close-table-options]');
const tableActionButtons = document.querySelectorAll('[data-table-action]');
const contractActionButtons = document.querySelectorAll('[data-contract-actions]');
const contractActionsModal = document.querySelector('#contractActionsModal');
const closeContractActionsButton = document.querySelector('[data-close-contract-actions]');
const contractActionsSubtitle = document.querySelector('#contractActionsSubtitle');
const contractModalActionButtons = document.querySelectorAll('[data-contract-modal-action]');
const financePeriodButtons = document.querySelectorAll('[data-period]');
const financeChart = document.querySelector('[data-finance-chart]');

let activeFilter = 'todos';
let selectedContract = '';

const chartPointsByPeriod = {
  1: [
    { x: 45, y: 48 },
    { x: 58, y: 35 },
    { x: 72, y: 28 },
    { x: 88, y: 18 }
  ],
  3: [
    { x: 10, y: 70 },
    { x: 28, y: 56 },
    { x: 46, y: 43 },
    { x: 64, y: 31 },
    { x: 84, y: 20 }
  ],
  6: [
    { x: 8, y: 68 },
    { x: 22, y: 50 },
    { x: 36, y: 38 },
    { x: 52, y: 44 },
    { x: 68, y: 26 },
    { x: 88, y: 16 }
  ],
  9: [
    { x: 6, y: 74 },
    { x: 17, y: 58 },
    { x: 28, y: 48 },
    { x: 39, y: 36 },
    { x: 50, y: 43 },
    { x: 61, y: 28 },
    { x: 72, y: 35 },
    { x: 83, y: 22 },
    { x: 94, y: 15 }
  ],
  12: [
    { x: 6, y: 72 },
    { x: 17, y: 58 },
    { x: 28, y: 46 },
    { x: 39, y: 34 },
    { x: 50, y: 39 },
    { x: 61, y: 26 },
    { x: 72, y: 35 },
    { x: 83, y: 21 },
    { x: 94, y: 12 }
  ],
  24: [
    { x: 5, y: 78 },
    { x: 13, y: 70 },
    { x: 21, y: 63 },
    { x: 29, y: 54 },
    { x: 37, y: 58 },
    { x: 45, y: 44 },
    { x: 53, y: 36 },
    { x: 61, y: 42 },
    { x: 69, y: 31 },
    { x: 77, y: 25 },
    { x: 85, y: 19 },
    { x: 94, y: 10 }
  ]
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
    closeNotificationModal();
    closeTableOptionsModal();
    closeContractActionsModal();
  }
});

function openNotificationModal() {
  if (notificationModal) {
    notificationModal.hidden = false;
    document.body.classList.add('modal-open');
    closeNotificationButton?.focus();
  }
}

function closeNotificationModal() {
  if (notificationModal) {
    notificationModal.hidden = true;
    document.body.classList.remove('modal-open');
  }
}

function openTableOptionsModal() {
  if (tableOptionsModal) {
    tableOptionsModal.hidden = false;
    document.body.classList.add('modal-open');
    closeTableOptionsButton?.focus();
  }
}

function closeTableOptionsModal() {
  if (tableOptionsModal) {
    tableOptionsModal.hidden = true;
    document.body.classList.remove('modal-open');
  }
}

function openContractActionsModal(contractName) {
  selectedContract = contractName;
  const selectedRow = getSelectedContractRow();

  if (contractActionsSubtitle) {
    contractActionsSubtitle.textContent = `Contrato selecionado: ${contractName}.`;
  }

  if (selectedRow) {
    highlightContract(contractName);
  }

  if (contractActionsModal) {
    contractActionsModal.hidden = false;
    document.body.classList.add('modal-open');
    closeContractActionsButton?.focus();
  }
}

function closeContractActionsModal() {
  if (contractActionsModal) {
    contractActionsModal.hidden = true;
    document.body.classList.remove('modal-open');
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

function filterContracts() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  contractRows.forEach((row) => {
    const matchesSearch = row.textContent.toLowerCase().includes(query);
    const matchesFilter = activeFilter === 'todos' || row.dataset.contractStatus === activeFilter;

    row.hidden = !matchesSearch || !matchesFilter;
  });
}

function getSelectedContractRow() {
  return Array.from(contractRows).find((row) => row.dataset.contractName === selectedContract);
}

function highlightContract(contractName) {
  contractRows.forEach((row) => {
    row.classList.toggle('is-highlighted', row.dataset.contractName === contractName);
  });
}

function updateFinanceChart(period) {
  if (!financeChart) {
    return;
  }

  const points = chartPointsByPeriod[period] || chartPointsByPeriod[12];

  financeChart.innerHTML = points
    .map((point) => `<span style="--x: ${point.x}%; --y: ${point.y}%"></span>`)
    .join('');
}

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(text);
      button.classList.add('copied');
      button.textContent = '✓';

      window.setTimeout(() => {
        button.classList.remove('copied');
        button.textContent = '📋';
      }, 1200);
    } catch {
      button.textContent = '!';
    }
  });
});

if (notificationButton) {
  notificationButton.addEventListener('click', openNotificationModal);
}

if (closeNotificationButton) {
  closeNotificationButton.addEventListener('click', closeNotificationModal);
}

if (notificationModal) {
  notificationModal.addEventListener('click', (event) => {
    if (event.target === notificationModal) {
      closeNotificationModal();
    }
  });
}

if (tableOptionsButton) {
  tableOptionsButton.addEventListener('click', openTableOptionsModal);
}

if (closeTableOptionsButton) {
  closeTableOptionsButton.addEventListener('click', closeTableOptionsModal);
}

if (tableOptionsModal) {
  tableOptionsModal.addEventListener('click', (event) => {
    if (event.target === tableOptionsModal) {
      closeTableOptionsModal();
    }
  });
}

if (closeContractActionsButton) {
  closeContractActionsButton.addEventListener('click', closeContractActionsModal);
}

if (contractActionsModal) {
  contractActionsModal.addEventListener('click', (event) => {
    if (event.target === contractActionsModal) {
      closeContractActionsModal();
    }
  });
}

if (readNotificationButton) {
  readNotificationButton.addEventListener('click', () => {
    if (notificationCount) {
      notificationCount.textContent = '0';
      notificationCount.classList.add('is-read');
    }

    readNotificationButton.textContent = '✓✓ Lido';
    closeNotificationModal();
  });
}

if (searchInput) {
  searchInput.addEventListener('input', filterContracts);
}

if (filterButton) {
  filterButton.addEventListener('click', () => {
    const nextFilter = {
      todos: 'ativo',
      ativo: 'vencendo',
      vencendo: 'todos'
    };

    activeFilter = nextFilter[activeFilter];
    filterButton.textContent = `🔎 Filtros: ${activeFilter}`;
    filterContracts();
    showToast(`Filtro aplicado: ${activeFilter}.`);
  });
}

actionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.action);
  });
});

tableActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.tableAction);
    closeTableOptionsModal();
  });
});

contractActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openContractActionsModal(button.dataset.contractActions);
  });
});

contractModalActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.contractModalAction;
    const selectedRow = getSelectedContractRow();

    if (!selectedRow) {
      showToast('Contrato não encontrado.');
      return;
    }

    if (action === 'visualizar') {
      showToast('Pdf do contrato exportado.');
      closeContractActionsModal();
      return;
    }

    if (action === 'editar') {
      window.location.href = `editar-contrato.html?contrato=${encodeURIComponent(selectedContract)}`;
      return;
    }

    if (action === 'renovar') {
      const statusPill = selectedRow.querySelector('[data-contract-status-pill]');
      const validityCell = selectedRow.querySelector('[data-contract-validity]');

      selectedRow.dataset.contractStatus = 'ativo';
      statusPill.className = 'status-pill active';
      statusPill.textContent = '● Ativo';
      validityCell.innerHTML = '📅 15/09/2027 <small>Renovado por 12 meses</small>';
      showToast(`Contrato ${selectedContract} renovado com sucesso.`);
      closeContractActionsModal();
      return;
    }

    if (action === 'suspender') {
      const statusPill = selectedRow.querySelector('[data-contract-status-pill]');

      selectedRow.dataset.contractStatus = 'suspenso';
      statusPill.className = 'status-pill suspended';
      statusPill.textContent = '● Suspenso';
      showToast(`Contrato ${selectedContract} suspenso.`);
      closeContractActionsModal();
    }
  });
});

detailButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const contractName = button.dataset.detailContract;

    contractRows.forEach((row) => {
      row.classList.toggle('is-highlighted', row.dataset.contractName === contractName);
    });

    showToast(`Pdf do vencimento ${contractName} exportado com sucesso.`);
  });
});

financePeriodButtons.forEach((button) => {
  button.addEventListener('click', () => {
    financePeriodButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    updateFinanceChart(button.dataset.period);
    showToast(`Resumo financeiro filtrado por ${button.dataset.period} meses.`);
  });
});

updateFinanceChart('12');

if (exportReportButton) {
  exportReportButton.addEventListener('click', () => {
    showToast('Relatório exportado com sucesso.');
  });
}