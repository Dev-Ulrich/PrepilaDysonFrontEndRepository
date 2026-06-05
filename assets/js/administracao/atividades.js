const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const searchInput = document.querySelector('[data-activity-search]');
const categoryFilter = document.querySelector('[data-activity-filter]');
const activityItems = document.querySelectorAll('[data-activity-item]');
const emptyActivities = document.querySelector('[data-empty-activities]');
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

function filterActivities() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const category = categoryFilter ? categoryFilter.value : 'todos';
  let visibleCount = 0;

  activityItems.forEach((item) => {
    const matchesSearch = item.textContent.toLowerCase().includes(query);
    const matchesCategory = category === 'todos' || item.dataset.category === category;
    const isVisible = matchesSearch && matchesCategory;

    item.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (emptyActivities) {
    emptyActivities.hidden = visibleCount > 0;
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

[searchInput, categoryFilter].forEach((control) => {
  if (!control) {
    return;
  }

  control.addEventListener('input', filterActivities);
  control.addEventListener('change', filterActivities);
});

filterActivities();
