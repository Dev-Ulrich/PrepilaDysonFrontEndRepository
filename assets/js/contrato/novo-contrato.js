const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const form = document.querySelector('#newContractForm');
const statusMessage = document.querySelector('#newContractStatus');
const previewAcronym = document.querySelector('#previewAcronym');
const previewOrganization = document.querySelector('#previewOrganization');
const previewPlan = document.querySelector('#previewPlan');
const previewValue = document.querySelector('#previewValue');
const previewValidity = document.querySelector('#previewValidity');
const toast = document.querySelector('#contractsToast');

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
  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (window.PrepilaData) {
      const formData = new FormData(form);
      const contracts = PrepilaData.getContracts();
      contracts.unshift({
        id: crypto.randomUUID(),
        organization: formData.get('organization').trim(),
        acronym: formData.get('acronym').trim().toUpperCase(),
        owner: formData.get('owner').trim(),
        email: formData.get('email').trim(),
        plan: formData.get('plan'),
        status: formData.get('status'),
        value: Number(formData.get('value') || 0),
        billing: formData.get('billing'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        sla: formData.get('sla'),
        renewal: formData.get('renewal'),
        notes: formData.get('notes').trim(),
      });
      PrepilaData.saveContracts(contracts);
    }

    statusMessage.textContent = 'Contrato criado com sucesso.';
    showToast('Novo contrato cadastrado com sucesso.');
  });

  form.addEventListener('reset', () => {
    window.setTimeout(() => {
      updatePreview();
      statusMessage.textContent = '';
      showToast('Formulário limpo.');
    });
  });
}
