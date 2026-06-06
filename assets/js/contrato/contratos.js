const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const searchInput = document.querySelector('.contract-search-input');
const filterButton = document.querySelector('[data-filter-contracts]');
const exportReportButton = document.querySelector('[data-export-report]');
const tableOptionsButton = document.querySelector('[data-open-table-options]');
const tableOptionsModal = document.querySelector('#tableOptionsModal');
const closeTableOptionsButton = document.querySelector('[data-close-table-options]');
const tableActionButtons = document.querySelectorAll('[data-table-action]');
const contractActionsModal = document.querySelector('#contractActionsModal');
const closeContractActionsButton = document.querySelector('[data-close-contract-actions]');
const contractActionsSubtitle = document.querySelector('#contractActionsSubtitle');
const contractModalActionButtons = document.querySelectorAll('[data-contract-modal-action]');
const financePeriodButtons = document.querySelectorAll('[data-period]');
const financeChart = document.querySelector('[data-finance-chart]');
const contractsTable = document.querySelector('.contracts-table');
const contractHead = document.querySelector('.contract-head');
const toast = document.querySelector('#contractsToast');

let activeFilter = 'todos';
let selectedContractId = '';
let contracts = window.PrepilaData ? PrepilaData.getContracts() : [];

const chartPointsByPeriod = {
  1: [{ x: 45, y: 48 }, { x: 58, y: 35 }, { x: 72, y: 28 }, { x: 88, y: 18 }],
  3: [{ x: 10, y: 70 }, { x: 28, y: 56 }, { x: 46, y: 43 }, { x: 64, y: 31 }, { x: 84, y: 20 }],
  6: [{ x: 8, y: 68 }, { x: 22, y: 50 }, { x: 36, y: 38 }, { x: 52, y: 44 }, { x: 68, y: 26 }, { x: 88, y: 16 }],
  9: [{ x: 6, y: 74 }, { x: 17, y: 58 }, { x: 28, y: 48 }, { x: 39, y: 36 }, { x: 50, y: 43 }, { x: 61, y: 28 }, { x: 72, y: 35 }, { x: 83, y: 22 }, { x: 94, y: 15 }],
  12: [{ x: 6, y: 72 }, { x: 17, y: 58 }, { x: 28, y: 46 }, { x: 39, y: 34 }, { x: 50, y: 39 }, { x: 61, y: 26 }, { x: 72, y: 35 }, { x: 83, y: 21 }, { x: 94, y: 12 }],
  24: [{ x: 5, y: 78 }, { x: 13, y: 70 }, { x: 21, y: 63 }, { x: 29, y: 54 }, { x: 37, y: 58 }, { x: 45, y: 44 }, { x: 53, y: 36 }, { x: 61, y: 42 }, { x: 69, y: 31 }, { x: 77, y: 25 }, { x: 85, y: 19 }, { x: 94, y: 10 }]
};

function setSidebarState(isOpen) {
  document.body.classList.toggle('sidebar-open', isOpen);
  if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', String(isOpen));
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function openModal(modal, focusTarget) {
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  focusTarget?.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
}

function closeAllModals() {
  closeModal(notificationModal);
  closeModal(tableOptionsModal);
  closeModal(contractActionsModal);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function formatDate(value) {
  if (!value) return 'Sem data';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function normalizeStatus(status) {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('suspenso')) return 'suspenso';
  if (normalized.includes('pendente') || normalized.includes('vencendo')) return 'vencendo';
  return 'ativo';
}

function statusMarkup(status) {
  const normalized = normalizeStatus(status);
  const config = {
    ativo: ['active', 'Ativo'],
    vencendo: ['warning', status === 'Pendente' ? 'Pendente' : 'Vencendo'],
    suspenso: ['suspended', 'Suspenso'],
  }[normalized];
  return `<strong class="status-pill ${config[0]}" data-contract-status-pill>● ${config[1]}</strong>`;
}

function getFilteredContracts() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  return contracts.filter((contract) => {
    const matchesSearch = `${contract.acronym} ${contract.organization} ${contract.owner} ${contract.plan}`.toLowerCase().includes(query);
    const matchesFilter = activeFilter === 'todos' || normalizeStatus(contract.status) === activeFilter;
    return matchesSearch && matchesFilter;
  });
}

function createContractRow(contract) {
  const status = normalizeStatus(contract.status);
  return `
    <div class="contract-row" role="row" data-contract-row data-contract-id="${contract.id}" data-contract-name="${escapeHtml(contract.acronym)}" data-contract-status="${status}">
      <span role="cell"><strong>${escapeHtml(contract.acronym)}</strong><small>${escapeHtml(contract.organization)}</small></span>
      <span role="cell">${escapeHtml(contract.plan)}</span>
      <span role="cell">${statusMarkup(contract.status)}</span>
      <span role="cell" data-contract-validity>📅 ${formatDate(contract.endDate)} <small>${escapeHtml(contract.renewal)}</small></span>
      <span role="cell">${formatCurrency(contract.value)} <small>${escapeHtml(contract.billing)}</small></span>
      <span role="cell"><button class="icon-button" type="button" aria-label="Mais ações ${escapeHtml(contract.acronym)}" data-contract-actions="${contract.id}">⋮</button></span>
    </div>
  `;
}

function renderContracts() {
  if (!contractsTable || !contractHead) return;
  contractsTable.innerHTML = '';
  contractsTable.append(contractHead);
  contractsTable.insertAdjacentHTML('beforeend', getFilteredContracts().map(createContractRow).join(''));
}

function saveContracts() {
  if (window.PrepilaData) PrepilaData.saveContracts(contracts);
}

function openContractActions(contractId) {
  selectedContractId = contractId;
  const contract = contracts.find((item) => item.id === contractId);
  if (!contract) return;

  if (contractActionsSubtitle) {
    contractActionsSubtitle.textContent = `Contrato selecionado: ${contract.acronym}.`;
  }

  openModal(contractActionsModal, closeContractActionsButton);
}

function updateFinanceChart(period) {
  if (!financeChart) return;
  const points = chartPointsByPeriod[period] || chartPointsByPeriod[12];
  financeChart.innerHTML = points.map((point) => `<span style="--x: ${point.x}%; --y: ${point.y}%"></span>`).join('');
}

function exportContracts(filename = 'contratos.json') {
  if (window.PrepilaData) PrepilaData.downloadFile(filename, JSON.stringify(contracts, null, 2));
}

if (sidebarToggle && sidebar) sidebarToggle.addEventListener('click', () => setSidebarState(!document.body.classList.contains('sidebar-open')));
if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', () => setSidebarState(false));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSidebarState(false);
    closeAllModals();
  }
});

if (notificationButton) notificationButton.addEventListener('click', () => openModal(notificationModal, closeNotificationButton));
if (closeNotificationButton) closeNotificationButton.addEventListener('click', () => closeModal(notificationModal));
if (tableOptionsButton) tableOptionsButton.addEventListener('click', () => openModal(tableOptionsModal, closeTableOptionsButton));
if (closeTableOptionsButton) closeTableOptionsButton.addEventListener('click', () => closeModal(tableOptionsModal));
if (closeContractActionsButton) closeContractActionsButton.addEventListener('click', () => closeModal(contractActionsModal));

[notificationModal, tableOptionsModal, contractActionsModal].forEach((modal) => {
  if (!modal) return;
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

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

if (searchInput) searchInput.addEventListener('input', renderContracts);

if (filterButton) {
  filterButton.addEventListener('click', () => {
    const nextFilter = { todos: 'ativo', ativo: 'vencendo', vencendo: 'suspenso', suspenso: 'todos' };
    activeFilter = nextFilter[activeFilter];
    filterButton.textContent = `🔎 Filtros: ${activeFilter}`;
    renderContracts();
    showToast(`Filtro aplicado: ${activeFilter}.`);
  });
}

if (contractsTable) {
  contractsTable.addEventListener('click', (event) => {
    const actionButton = event.target.closest('[data-contract-actions]');
    if (actionButton) openContractActions(actionButton.dataset.contractActions);
  });
}

tableActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.tableAction || '';
    if (action.includes('Atualizada')) {
      contracts = window.PrepilaData ? PrepilaData.getContracts() : contracts;
      renderContracts();
    }
    if (action.includes('exportados')) exportContracts('tabela-contratos.json');
    showToast(action);
    closeModal(tableOptionsModal);
  });
});

contractModalActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.contractModalAction;
    const contract = contracts.find((item) => item.id === selectedContractId);
    if (!contract) {
      showToast('Contrato não encontrado.');
      return;
    }

    if (action === 'visualizar') {
      const content = JSON.stringify(contract, null, 2);
      if (window.PrepilaData) PrepilaData.downloadFile(`${contract.acronym}-contrato.json`, content);
      showToast(`Contrato ${contract.acronym} exportado.`);
    }

    if (action === 'editar') {
      window.location.href = `editar-contrato.html?contrato=${encodeURIComponent(contract.id)}`;
      return;
    }

    if (action === 'renovar') {
      const endDate = new Date(`${contract.endDate || '2026-06-06'}T00:00:00`);
      endDate.setFullYear(endDate.getFullYear() + 1);
      contract.endDate = endDate.toISOString().slice(0, 10);
      contract.status = 'Ativo';
      saveContracts();
      renderContracts();
      showToast(`Contrato ${contract.acronym} renovado com sucesso.`);
    }

    if (action === 'suspender') {
      contract.status = 'Suspenso';
      saveContracts();
      renderContracts();
      showToast(`Contrato ${contract.acronym} suspenso.`);
    }

    closeModal(contractActionsModal);
  });
});

document.querySelectorAll('[data-detail-contract]').forEach((button) => {
  button.addEventListener('click', () => {
    const contract = contracts.find((item) => item.acronym === button.dataset.detailContract);
    if (!contract) return showToast('Contrato não encontrado.');
    if (window.PrepilaData) PrepilaData.downloadFile(`${contract.acronym}-vencimento.json`, JSON.stringify(contract, null, 2));
    showToast(`Dados de ${contract.acronym} exportados.`);
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

if (exportReportButton) {
  exportReportButton.addEventListener('click', () => {
    exportContracts('relatorio-contratos.json');
    showToast('Relatório exportado com sucesso.');
  });
}

updateFinanceChart('12');
renderContracts();
