const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const roleSearch = document.querySelector('[data-role-search]');
const scopeFilter = document.querySelector('[data-scope-filter]');
const roleItems = document.querySelectorAll('[data-role-item]');
const emptyRoles = document.querySelector('[data-empty-roles]');
const syncButton = document.querySelector('[data-sync-permissions]');
const exportButton = document.querySelector('[data-export-permissions]');
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

function filterRoles() {
  const query = roleSearch ? roleSearch.value.trim().toLowerCase() : '';
  const scope = scopeFilter ? scopeFilter.value : 'todos';
  let visibleCount = 0;

  roleItems.forEach((item) => {
    const matchesSearch = item.textContent.toLowerCase().includes(query);
    const matchesScope = scope === 'todos' || item.dataset.scope === scope;
    const isVisible = matchesSearch && matchesScope;

    item.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (emptyRoles) {
    emptyRoles.hidden = visibleCount > 0;
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
    closeModal(notificationModal);
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

if (notificationModal) {
  notificationModal.addEventListener('click', (event) => {
    if (event.target === notificationModal) {
      closeModal(notificationModal);
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
    closeModal(notificationModal);
    showToast('Notificações marcadas como lidas.');
  });
}

[roleSearch, scopeFilter].forEach((control) => {
  if (!control) {
    return;
  }

  control.addEventListener('input', filterRoles);
  control.addEventListener('change', filterRoles);
});

if (syncButton) {
  syncButton.addEventListener('click', () => {
    showToast('Permissões sincronizadas com sucesso.');
  });
}

if (exportButton) {
  exportButton.addEventListener('click', () => {
    showToast('Matriz de permissões exportada.');
  });
}

filterRoles();
