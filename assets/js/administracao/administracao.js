const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const settingsButtons = document.querySelectorAll('[data-open-settings]');
const settingsModal = document.querySelector('#settingsModal');
const closeSettingsButton = document.querySelector('[data-close-settings]');
const settingsActionButtons = document.querySelectorAll('[data-settings-action]');
const userModal = document.querySelector('#userModal');
const openUserModalButton = document.querySelector('[data-open-user-modal]');
const closeUserModalButton = document.querySelector('[data-close-user-modal]');
const createUserButtons = document.querySelectorAll('[data-create-user]');
const searchInput = document.querySelector('[data-user-search]');
const roleFilter = document.querySelector('[data-role-filter]');
const statusFilter = document.querySelector('[data-status-filter]');
const userRows = document.querySelectorAll('[data-user-row]');
const userCount = document.querySelector('[data-user-count]');
const editButtons = document.querySelectorAll('[data-edit-user]');
const deleteButtons = document.querySelectorAll('[data-delete-user]');
const backupButton = document.querySelector('[data-backup-action]');
const toast = document.querySelector('#adminToast');

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
  closeModal(userModal);
}

function getUserName(button) {
  return button.closest('[data-user-row]')?.querySelector('b')?.textContent || 'usuário';
}

function filterUsers() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const role = roleFilter ? roleFilter.value : 'todos';
  const status = statusFilter ? statusFilter.value : 'todos';
  let visibleCount = 0;

  userRows.forEach((row) => {
    const matchesSearch = row.textContent.toLowerCase().includes(query);
    const matchesRole = role === 'todos' || row.dataset.role === role;
    const matchesStatus = status === 'todos' || row.dataset.status === status;
    const isVisible = matchesSearch && matchesRole && matchesStatus;

    row.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (userCount) {
    userCount.textContent = `Exibindo ${visibleCount} de 28 usuários`;
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

settingsButtons.forEach((button) => {
  button.addEventListener('click', () => {
    openModal(settingsModal, closeSettingsButton);
  });
});

if (closeSettingsButton) {
  closeSettingsButton.addEventListener('click', () => {
    closeModal(settingsModal);
  });
}

if (openUserModalButton) {
  openUserModalButton.addEventListener('click', () => {
    openModal(userModal, closeUserModalButton);
  });
}

if (closeUserModalButton) {
  closeUserModalButton.addEventListener('click', () => {
    closeModal(userModal);
  });
}

[notificationModal, settingsModal, userModal].forEach((modal) => {
  if (!modal) {
    return;
  }

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

[searchInput, roleFilter, statusFilter].forEach((control) => {
  if (!control) {
    return;
  }

  control.addEventListener('input', filterUsers);
  control.addEventListener('change', filterUsers);
});

editButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(`Edição aberta para ${getUserName(button)}.`);
  });
});

deleteButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(`Exclusão solicitada para ${getUserName(button)}.`);
  });
});

settingsActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.settingsAction);
    closeModal(settingsModal);
  });
});

createUserButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(`Fluxo de criação aberto: ${button.dataset.createUser}.`);
    closeModal(userModal);
  });
});

if (backupButton) {
  backupButton.addEventListener('click', () => {
    showToast('Rotina de backup e segurança iniciada.');
  });
}

filterUsers();
