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
const startDateInput = document.querySelector('[data-start-date]');
const endDateInput = document.querySelector('[data-end-date]');
const chartPeriodSelect = document.querySelector('[data-chart-period]');
const windowSelect = document.querySelector('[data-window-select]');
const activeOperations = document.querySelector('[data-active-operations]');
const occurrenceCount = document.querySelector('[data-occurrence-count]');
const efficiency = document.querySelector('[data-efficiency]');
const energyLine = document.querySelector('[data-energy-line]');
const operationsTable = document.querySelector('.operations-table');
const operationHead = document.querySelector('.operation-head');
const queueList = document.querySelector('.queue-list');
const openOperationButtons = document.querySelectorAll('[data-open-operation-modal]');
const operationModal = document.querySelector('#operationModal');
const closeOperationButtons = document.querySelectorAll('[data-close-operation-modal]');
const operationForm = document.querySelector('[data-operation-form]');
const operationModalTitle = document.querySelector('[data-operation-modal-title]');
const operationModalDescription = document.querySelector('[data-operation-modal-description]');
const toast = document.querySelector('#operationsToast');

const chartSnapshots = {
  'Últimos 7 dias': '1,30 15,28 29,21 43,26 57,20 71,19 85,16 99,18',
  'Últimas 24 horas': '1,36 15,33 29,29 43,24 57,21 71,23 85,18 99,20',
  'Últimos 30 dias': '1,38 15,34 29,30 43,28 57,24 71,20 85,18 99,14'
};

const typeConfig = {
  transfer: { label: 'Transferência', className: 'transfer', icon: '↔' },
  orbital: { label: 'Ajuste', className: 'orbital', icon: '🛰️' },
  energy: { label: 'Energia', className: 'energy', icon: '⚡' },
  maintenance: { label: 'Manutenção', className: 'maintenance', icon: '🔧' },
  calibration: { label: 'Calibração', className: 'calibration', icon: '◎' },
};

const statusConfig = {
  andamento: { label: 'Em andamento', className: 'progress' },
  pendente: { label: 'Pendente', className: 'pending' },
  concluida: { label: 'Concluída', className: 'done' },
};

const people = ['👨‍💼', '👩‍💼', '👨‍🚀', '🧑‍🔧', '👩‍💻'];
let currentStatusFilter = 'todos';
let operations = window.PrepilaData ? PrepilaData.getOperations() : readInitialOperations();

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
  closeModal(operationModal);
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

function normalizeDateTime(value) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/);

  if (!match) {
    return '';
  }

  const [, day, month, year, hour, minute] = match;
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function formatDateTime(value) {
  if (!value) {
    return '';
  }

  const [date, time] = value.split('T');
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year} ${time}`;
}

function formatDate(value) {
  if (!value) {
    return '';
  }

  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function readInitialOperations() {
  return [...document.querySelectorAll('[data-table-row]')].map((row, index) => {
    const cells = row.querySelectorAll('[role="cell"]');
    const typeChip = cells[1]?.querySelector('.type-chip');
    const type = Object.entries(typeConfig).find(([, config]) => typeChip?.classList.contains(config.className))?.[0] || 'transfer';
    const owner = cells[6]?.textContent.trim() || '';

    return {
      id: crypto.randomUUID(),
      name: cells[0]?.textContent.trim() || `Operação ${index + 1}`,
      type,
      station: cells[2]?.textContent.trim() || '',
      status: row.dataset.status || 'pendente',
      start: normalizeDateTime(cells[4]?.textContent.trim() || ''),
      end: normalizeDateTime(cells[5]?.textContent.trim() || ''),
      owner: owner.replace(/^[^\wÀ-ÿ]+/, '').trim(),
      person: cells[6]?.querySelector('.person')?.textContent.trim() || people[index % people.length],
    };
  });
}

function createOperationRow(operation) {
  const type = typeConfig[operation.type] || typeConfig.transfer;
  const status = statusConfig[operation.status] || statusConfig.pendente;

  return `
    <div class="operation-row" role="row" data-table-row data-status="${operation.status}" data-id="${operation.id}">
      <span role="cell">${escapeHtml(operation.name)}</span>
      <span role="cell"><b class="type-chip ${type.className}">${type.label}</b></span>
      <span role="cell">${escapeHtml(operation.station)}</span>
      <span role="cell"><b class="status-badge ${status.className}">${status.label}</b></span>
      <span role="cell">${formatDateTime(operation.start)}</span>
      <span role="cell">${formatDateTime(operation.end)}</span>
      <span role="cell"><span class="person">${operation.person}</span> ${escapeHtml(operation.owner)}</span>
      <span role="cell"><button class="icon-button" type="button" aria-label="Editar ${escapeHtml(operation.name)}" data-edit-operation="${operation.id}">✎</button><button class="icon-button danger-action" type="button" aria-label="Excluir ${escapeHtml(operation.name)}" data-delete-operation="${operation.id}">🗑</button></span>
    </div>
  `;
}

function createQueueRow(operation) {
  const type = typeConfig[operation.type] || typeConfig.transfer;
  const status = statusConfig[operation.status] || statusConfig.pendente;
  return `
    <article data-operation-row data-status="${operation.status}">
      <span class="queue-icon ${type.className}">${type.icon}</span>
      <div><strong>${escapeHtml(operation.name)}</strong><small>${escapeHtml(operation.station)}</small></div>
      <b class="status-badge ${status.className}">${status.label}</b>
      <time>${formatDateTime(operation.start).slice(-5)}</time>
    </article>
  `;
}

function renderOperations() {
  if (!operationsTable || !operationHead) {
    return;
  }

  const visibleOperations = currentStatusFilter === 'todos'
    ? operations
    : operations.filter((operation) => operation.status === currentStatusFilter);

  operationsTable.innerHTML = '';
  operationsTable.append(operationHead);
  operationsTable.insertAdjacentHTML('beforeend', visibleOperations.map(createOperationRow).join(''));

  if (activeOperations) {
    activeOperations.textContent = String(operations.length);
  }

  if (occurrenceCount) {
    occurrenceCount.textContent = String(operations.filter((operation) => operation.status === 'pendente').length);
  }

  if (queueList) {
    const queueOperations = visibleOperations.slice(0, 5);
    queueList.innerHTML = queueOperations.map(createQueueRow).join('');
  }
}

function updateDateRange() {
  const start = startDateInput?.value;
  const end = endDateInput?.value;

  if (!start || !end) {
    showToast('Escolha a data inicial e final.');
    return;
  }

  if (start > end) {
    showToast('A data inicial não pode ser maior que a final.');
    return;
  }

  const startDate = new Date(`${start}T00:00:00`);
  const endDate = new Date(`${end}T00:00:00`);
  const days = Math.max(1, Math.round((endDate - startDate) / 86400000) + 1);

  if (activeOperations) activeOperations.textContent = String(Math.max(12, Math.min(99, operations.length + days * 5)));
  if (occurrenceCount) occurrenceCount.textContent = String(Math.max(1, Math.min(12, Math.round(days / 2))));
  if (efficiency) efficiency.textContent = `${Math.min(98.7, 91 + days * 0.7).toFixed(1).replace('.', ',')}%`;
  if (energyLine) {
    const offset = Math.min(10, days);
    energyLine.setAttribute('points', `1,${34 - offset} 15,28 29,${24 - Math.floor(offset / 2)} 43,26 57,20 71,${21 - Math.floor(offset / 2)} 85,16 99,18`);
  }

  showToast(`Período atualizado: ${formatDate(start)} até ${formatDate(end)}.`);
}

function filterOperations(status) {
  currentStatusFilter = status;
  renderOperations();
  closeModal(filtersModal);
  showToast(status === 'todos' ? 'Todas as operações exibidas.' : `Filtro aplicado: ${status}.`);
}

function updateChartPeriod(period) {
  const points = chartSnapshots[period];

  if (energyLine && points) {
    energyLine.setAttribute('points', points);
  }

  showToast(`Gráfico atualizado: ${period}.`);
}

function resetOperationForm(mode = 'create') {
  if (!operationForm) {
    return;
  }

  operationForm.reset();
  operationForm.elements.operationId.value = '';

  if (operationModalTitle) {
    operationModalTitle.textContent = mode === 'edit' ? 'Editar operação' : 'Nova operação';
  }

  if (operationModalDescription) {
    operationModalDescription.textContent = mode === 'edit'
      ? 'Atualize os dados e datas da operação.'
      : 'Cadastre uma operação e defina datas livremente.';
  }
}

function openCreateOperation() {
  resetOperationForm('create');
  openModal(operationModal, operationForm?.elements.name);
}

function openEditOperation(operationId) {
  const operation = operations.find((item) => item.id === operationId);

  if (!operation || !operationForm) {
    return;
  }

  resetOperationForm('edit');
  operationForm.elements.operationId.value = operation.id;
  operationForm.elements.name.value = operation.name;
  operationForm.elements.type.value = operation.type;
  operationForm.elements.station.value = operation.station;
  operationForm.elements.status.value = operation.status;
  operationForm.elements.start.value = operation.start;
  operationForm.elements.end.value = operation.end;
  operationForm.elements.owner.value = operation.owner;
  openModal(operationModal, operationForm.elements.name);
}

function saveOperation(event) {
  event.preventDefault();

  if (!operationForm.checkValidity()) {
    operationForm.reportValidity();
    return;
  }

  const formData = new FormData(operationForm);
  const operationId = formData.get('operationId');
  const operationData = {
    id: operationId || crypto.randomUUID(),
    name: formData.get('name').trim(),
    type: formData.get('type'),
    station: formData.get('station').trim(),
    status: formData.get('status'),
    start: formData.get('start'),
    end: formData.get('end'),
    owner: formData.get('owner').trim(),
    person: operationId ? operations.find((operation) => operation.id === operationId)?.person || '👨‍💼' : people[operations.length % people.length],
  };

  if (operationData.start > operationData.end) {
    showToast('A data de início não pode ser maior que a previsão de término.');
    return;
  }

  if (operationId) {
    operations = operations.map((operation) => operation.id === operationId ? operationData : operation);
    if (window.PrepilaData) PrepilaData.saveOperations(operations);
    showToast(`Operação ${operationData.name} atualizada.`);
  } else {
    operations.unshift(operationData);
    if (window.PrepilaData) PrepilaData.saveOperations(operations);
    showToast(`Operação ${operationData.name} adicionada.`);
  }

  closeModal(operationModal);
  renderOperations();
}

function deleteOperation(operationId) {
  const operation = operations.find((item) => item.id === operationId);

  if (!operation) {
    return;
  }

  const shouldDelete = window.confirm(`Excluir ${operation.name}?`);

  if (!shouldDelete) {
    return;
  }

  operations = operations.filter((item) => item.id !== operationId);
  if (window.PrepilaData) PrepilaData.saveOperations(operations);
  renderOperations();
  showToast(`Operação ${operation.name} excluída.`);
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

[notificationModal, filtersModal, operationModal].forEach((modal) => {
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

[startDateInput, endDateInput].forEach((input) => {
  if (!input) {
    return;
  }

  input.addEventListener('change', updateDateRange);
});

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

openOperationButtons.forEach((button) => {
  button.addEventListener('click', openCreateOperation);
});

closeOperationButtons.forEach((button) => {
  button.addEventListener('click', () => {
    closeModal(operationModal);
  });
});

if (operationForm) {
  operationForm.addEventListener('submit', saveOperation);
}

if (operationsTable) {
  operationsTable.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-operation]');
    const deleteButton = event.target.closest('[data-delete-operation]');

    if (editButton) {
      openEditOperation(editButton.dataset.editOperation);
    }

    if (deleteButton) {
      deleteOperation(deleteButton.dataset.deleteOperation);
    }
  });
}

renderOperations();
