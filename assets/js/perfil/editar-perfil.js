const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const editProfileForm = document.querySelector('#editProfileForm');
const editProfileStatus = document.querySelector('#editProfileStatus');
const profileEmoji = document.querySelector('.profile-emoji');
const emojiInputs = document.querySelectorAll('input[name="avatarEmoji"]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');

function getCurrentProfileUser() {
  if (typeof getPrepilaCurrentUser === 'function') {
    return getPrepilaCurrentUser();
  }

  try {
    return JSON.parse(sessionStorage.getItem('prepila-auth-user') || localStorage.getItem('prepila-auth-user') || '{}');
  } catch {
    return {};
  }
}

function getRoleIcon(role) {
  if (role === 'Administrador') return '👑';
  if (role === 'Operador') return '🛰️';
  if (role === 'Analista') return '📊';
  if (role === 'Técnico') return '🛠️';
  if (role === 'Gestora') return '📋';
  if (role === 'Supervisor') return '🛡️';
  return '🔐';
}

function setFieldValue(fieldName, value) {
  const field = editProfileForm?.elements[fieldName];

  if (field && value) {
    if (field.tagName === 'SELECT' && ![...field.options].some((option) => option.value === value)) {
      field.add(new Option(value, value));
    }

    field.value = value;
  }
}

function renderEditProfileUser() {
  if (!editProfileForm) {
    return;
  }

  const user = getCurrentProfileUser();
  const roleIcon = getRoleIcon(user.role);
  const selectedAvatar = [...emojiInputs].find((input) => input.value === user.avatar);

  if (profileEmoji && user.avatar) {
    profileEmoji.textContent = user.avatar;
  }

  if (selectedAvatar) {
    selectedAvatar.checked = true;
  }

  const avatarTitle = document.querySelector('#avatar-title');
  const rolePill = document.querySelector('.role-pill');

  if (avatarTitle) {
    avatarTitle.textContent = user.displayName || user.username || 'Usuário Prepila Dyson';
  }

  if (rolePill) {
    rolePill.textContent = `${roleIcon} ${user.role || 'Usuário'}`;
  }

  setFieldValue('displayName', user.displayName);
  setFieldValue('username', user.username);
  setFieldValue('email', user.email);
  setFieldValue('position', user.cargo);
  setFieldValue('accessLevel', user.role);
  setFieldValue('mfa', user.mfa);
}

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

emojiInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (profileEmoji) {
      profileEmoji.textContent = input.value;
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

if (editProfileForm && editProfileStatus) {
  editProfileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(editProfileForm);
    const storedUser = JSON.parse(sessionStorage.getItem('prepila-auth-user') || localStorage.getItem('prepila-auth-user') || '{}');
    const updatedUser = {
      ...storedUser,
      username: formData.get('username'),
      displayName: formData.get('displayName'),
      email: formData.get('email'),
      cargo: formData.get('position'),
      role: formData.get('accessLevel'),
      avatar: formData.get('avatarEmoji'),
      mfa: formData.get('mfa'),
      loggedAt: new Date().toISOString()
    };

    sessionStorage.setItem('prepila-auth-user', JSON.stringify(updatedUser));

    if (localStorage.getItem('prepila-auth-user')) {
      localStorage.setItem('prepila-auth-user', JSON.stringify(updatedUser));
    }

    if (typeof renderPrepilaPrivateSession === 'function') {
      renderPrepilaPrivateSession();
    }

    renderEditProfileUser();
    editProfileStatus.textContent = 'Alterações salvas.';
  });

  editProfileForm.addEventListener('reset', () => {
    window.setTimeout(() => {
      if (profileEmoji) {
        profileEmoji.textContent = '👨‍💼';
      }

      editProfileStatus.textContent = '';
    });
  });
}

renderEditProfileUser();
