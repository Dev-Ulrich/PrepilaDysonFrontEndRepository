const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const form = document.querySelector('#editContractForm');
const statusMessage = document.querySelector('#newContractStatus');
const previewAcronym = document.querySelector('#previewAcronym');
const previewOrganization = document.querySelector('#previewOrganization');
const previewPlan = document.querySelector('#previewPlan');
const previewValue = document.querySelector('#previewValue');
const previewValidity = document.querySelector('#previewValidity');
const toast = document.querySelector('#contractsToast');

const contractsData = {
  ESA: {
    organization: 'European Space Agency',
    acronym: 'ESA',
    owner: 'Equipe ESA Procurement',
    email: 'procurement@esa.int',
    plan: 'SaaS anual',
    status: 'Ativo',
    value: '2200000',
    billing: 'Anual',
    startDate: '2026-01-15',
    endDate: '2026-09-15',
    sla: '99.9% disponibilidade',
    renewal: 'Automática',
    notes: 'Contrato corporativo para monitoramento operacional da constelação energética.'
  },
  JAXA: {
    organization: 'Agência Espacial Japonesa',
    acronym: 'JAXA',
    owner: 'JAXA Operations',
    email: 'ops@jaxa.jp',
    plan: 'SaaS anual',
    status: 'Ativo',
    value: '2500000',
    billing: 'Anual',
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    sla: '99.9% disponibilidade',
    renewal: 'Automática',
    notes: 'Plano anual com integração aos relatórios de eficiência orbital.'
  },
  NASA: {
    organization: 'National Aeronautics',
    acronym: 'NASA',
    owner: 'NASA Administration',
    email: 'contracts@nasa.gov',
    plan: 'SaaS mensal',
    status: 'Ativo',
    value: '250000',
    billing: 'Mensal',
    startDate: '2026-01-05',
    endDate: '2026-06-05',
    sla: '99.5% disponibilidade',
    renewal: 'Automática',
    notes: 'Contrato com renovação mensal automática.'
  },
  SpaceX: {
    organization: 'Space Exploration Technologies',
    acronym: 'SPX',
    owner: 'SpaceX Finance',
    email: 'finance@spacex.com',
    plan: 'SaaS anual',
    status: 'Em análise',
    value: '1800000',
    billing: 'Anual',
    startDate: '2026-01-10',
    endDate: '2026-07-10',
    sla: 'Plano customizado',
    renewal: 'Manual',
    notes: 'Contrato em janela de renovação, requer validação comercial.'
  }
};

function setSidebarState(isOpen) {
  document.body.classList.toggle('sidebar-open', isOpen);

  if (sidebarToggle) {
    sidebarToggle.setAttribute('aria-expanded', String(isOpen));
  }
}

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

function formatCurrency(value) {
  const numericValue = Number(value || 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(numericValue);
}

function updatePreview() {
  if (!form) {
    return;
  }

  const formData = new FormData(form);
  const organization = formData.get('organization') || 'Nova organização';
  const acronym = formData.get('acronym') || 'NEW';
  const plan = formData.get('plan') || 'Plano não selecionado';
  const value = formData.get('value');
  const endDate = formData.get('endDate');

  previewAcronym.textContent = String(acronym).slice(0, 8).toUpperCase();
  previewOrganization.textContent = organization;
  previewPlan.textContent = plan;
  previewValue.textContent = formatCurrency(value);
  previewValidity.textContent = endDate ? `Válido até ${endDate}` : 'Validade pendente';
}

function fillForm(contractData) {
  Object.entries(contractData).forEach(([name, value]) => {
    const field = form.elements[name];

    if (field) {
      field.value = value;
    }
  });

  updatePreview();
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
  }
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

if (form) {
  const contractName = new URLSearchParams(window.location.search).get('contrato') || 'ESA';
  const contractData = contractsData[contractName] || contractsData.ESA;

  fillForm(contractData);

  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    statusMessage.textContent = 'Alterações salvas com sucesso.';
    showToast(`Contrato ${contractName} atualizado com sucesso.`);
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      fillForm(contractData);
      statusMessage.textContent = '';
      showToast('Dados originais restaurados.');
    });
  });
}
