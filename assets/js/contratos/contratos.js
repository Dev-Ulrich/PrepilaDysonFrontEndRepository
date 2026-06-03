const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const copyButtons = document.querySelectorAll('[data-copy]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const toast = document.querySelector('#contractsToast');
const tableOptionsButton = document.querySelector('[data-open-table-options]');
const tableOptionsModal = document.querySelector('#tableOptionsModal');
const closeTableOptionsButton = document.querySelector('[data-close-table-options]');

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

function openNotificationModal() {
  if (notificationModal) {
    notificationModal.hidden = false;
    document.body.classList.add('modal-open');
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
  }
}

function closeTableOptionsModal() {
  if (tableOptionsModal) {
    tableOptionsModal.hidden = true;
    document.body.classList.remove('modal-open');
  }
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

copyButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = '✓';
    } catch {
      button.textContent = '!';
    }
  });
});