const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');

const defaultUser = {
  username: 'admPrepilaDyson',
  displayName: 'Administrador Prepila Dyson',
  email: 'admPrepilaDyson@fiap.com.br',
  role: 'Administrador',
  cargo: 'Administrador Prepila Dyson',
  id: 'PD-ADM-001',
  avatar: '👨‍💼',
  memberSince: '02/06/2026',
  mfa: 'Ativo',
  loggedAt: new Date().toISOString()
};

const profileFallbacks = {
  'admPrepilaDyson': defaultUser,
  'Matheus Pereira': { email: 'matheus.pereira@fiap.com.br', role: 'Operador', cargo: 'Operador de Monitoramento', id: 'PD-OPR-002', avatar: '👨‍🚀', memberSince: '03/06/2026', mfa: 'Pendente' },
  'Victor Ulrich': { email: 'victor.ulrich@fiap.com.br', role: 'Administrador', cargo: 'Administrador', id: 'PD-ADM-003', avatar: '👨‍💼', memberSince: '03/06/2026', mfa: 'Ativo' },
  'Matheus Luca': { email: 'matheus.luca@fiap.com.br', role: 'Analista', cargo: 'Analista de Dados Energéticos', id: 'PD-ANA-004', avatar: '🧑‍💻', memberSince: '03/06/2026', mfa: 'Ativo' },
  'Arthur da Silva': { email: 'arthur.silva@fiap.com.br', role: 'Técnico', cargo: 'Técnico de Operações', id: 'PD-TEC-005', avatar: '🧑‍🔧', memberSince: '03/06/2026', mfa: 'Pendente' },
  'Yasmin Capi': { email: 'yasmin.capi@fiap.com.br', role: 'Gestora', cargo: 'Gestora de Relatórios', id: 'PD-GES-006', avatar: '👩‍💼', memberSince: '03/06/2026', mfa: 'Ativo' },
  'Alexandre Carlos': { email: 'alexandre.carlos@fiap.com.br', role: 'Supervisor', cargo: 'Supervisor Operacional', id: 'PD-SUP-007', avatar: '🧑‍🚀', memberSince: '03/06/2026', mfa: 'Ativo' }
};

function getStoredUser() {
  const sessionUser = parseStoredUser(sessionStorage.getItem('prepila-auth-user'));
  const rememberedUser = parseStoredUser(localStorage.getItem('prepila-auth-user'));
  const user = isCompleteStoredUser(sessionUser) ? sessionUser : rememberedUser || sessionUser;

  if (!user) {
    return defaultUser;
  }

  const fallback = profileFallbacks[user.username] || {};

  return {
    ...defaultUser,
    ...fallback,
    ...user,
    displayName: user.displayName || user.username || defaultUser.displayName
  };
}

function parseStoredUser(rawUser) {
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

function isCompleteStoredUser(user) {
  return Boolean(user?.username && user?.email && user?.role && user?.id);
}

function formatLoggedAt(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Sessão atual';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function getRoleIcon(role) {
  if (role === 'Administrador') return '👑';
  if (role === 'Gestora') return '📊';
  if (role === 'Supervisor') return '🛡️';
  if (role === 'Analista') return '📈';
  if (role === 'Técnico') return '🛠️';
  return '🛰️';
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function renderProfile() {
  const user = getStoredUser();
  const roleIcon = getRoleIcon(user.role);
  const permissionLevel = user.role === 'Administrador' ? 'Total' : 'Operacional';
  const roleLabel = `${roleIcon} ${user.role}`;

  setText('.user-card strong', user.displayName);
  setText('.user-card small', user.role);
  setText('.mini-avatar', user.avatar);
  setText('.profile-emoji', user.avatar);
  setText('#profile-title', user.displayName);
  setText('.role-pill', roleLabel);
  setText('.admin-level span:nth-child(2)', `Nível: ${user.role}`);

  const idLine = document.querySelector('.profile-identity p');
  if (idLine) {
    idLine.innerHTML = `ID: ${user.id} <button class="copy-button" type="button" aria-label="Copiar ID" data-copy="${user.id}">📋</button>`;
  }

  const emailValue = document.querySelector('.detail-list div:nth-child(1) dd');
  if (emailValue) {
    emailValue.innerHTML = `${user.email} <button class="copy-button" type="button" aria-label="Copiar email" data-copy="${user.email}">📋</button>`;
  }

  setText('.detail-list div:nth-child(3) dd', user.cargo);
  setText('.detail-list div:nth-child(4) dd', user.memberSince);

  const roleChip = document.querySelector('.role-chip');
  if (roleChip) {
    roleChip.textContent = roleLabel;
  }

  const lastAccess = document.querySelector('.status-card:nth-child(1) small');
  if (lastAccess) {
    lastAccess.textContent = formatLoggedAt(user.loggedAt);
  }

  const activeSessions = document.querySelector('.status-card:nth-child(3) small');
  if (activeSessions) {
    activeSessions.textContent = user.role === 'Administrador' ? '2 dispositivos' : '1 dispositivo';
  }

  const mfa = document.querySelector('.status-card:nth-child(4) small');
  if (mfa) {
    mfa.textContent = user.mfa;
    mfa.classList.toggle('success-text', user.mfa === 'Ativo');
  }

  document.querySelectorAll('.permissions-table em').forEach((level) => {
    level.textContent = permissionLevel;
  });
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

renderProfile();

document.querySelectorAll('[data-copy]').forEach((button) => {
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
