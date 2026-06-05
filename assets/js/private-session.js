const prepilaDefaultUser = {
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

const prepilaUserFallbacks = {
  admPrepilaDyson: prepilaDefaultUser,
  'Matheus Pereira': { email: 'matheus.pereira@fiap.com.br', role: 'Operador', cargo: 'Operador de Monitoramento', id: 'PD-OPR-002', avatar: '👨‍🚀', memberSince: '03/06/2026', mfa: 'Pendente' },
  'Victor Ulrich': { email: 'victor.ulrich@fiap.com.br', role: 'Administrador', cargo: 'Administrador', id: 'PD-ADM-003', avatar: '👨‍💼', memberSince: '03/06/2026', mfa: 'Ativo' },
  'Matheus Luca': { email: 'matheus.luca@fiap.com.br', role: 'Analista', cargo: 'Analista de Dados Energéticos', id: 'PD-ANA-004', avatar: '🧑‍💻', memberSince: '03/06/2026', mfa: 'Ativo' },
  'Arthur da Silva': { email: 'arthur.silva@fiap.com.br', role: 'Técnico', cargo: 'Técnico de Operações', id: 'PD-TEC-005', avatar: '🧑‍🔧', memberSince: '03/06/2026', mfa: 'Pendente' },
  'Yasmin Capi': { email: 'yasmin.capi@fiap.com.br', role: 'Gestora', cargo: 'Gestora de Relatórios', id: 'PD-GES-006', avatar: '👩‍💼', memberSince: '03/06/2026', mfa: 'Ativo' },
  'Alexandre Carlos': { email: 'alexandre.carlos@fiap.com.br', role: 'Supervisor', cargo: 'Supervisor Operacional', id: 'PD-SUP-007', avatar: '🧑‍🚀', memberSince: '03/06/2026', mfa: 'Ativo' }
};

function getPrepilaCurrentUser() {
  const sessionUser = parsePrepilaStoredUser(sessionStorage.getItem('prepila-auth-user'));
  const rememberedUser = parsePrepilaStoredUser(localStorage.getItem('prepila-auth-user'));
  const user = isCompletePrepilaUser(sessionUser) ? sessionUser : rememberedUser || sessionUser;

  if (!user) {
    return prepilaDefaultUser;
  }

  const fallback = prepilaUserFallbacks[user.username] || {};

  return {
    ...prepilaDefaultUser,
    ...fallback,
    ...user,
    displayName: user.displayName || user.username || prepilaDefaultUser.displayName
  };
}

function parsePrepilaStoredUser(rawUser) {
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

function isCompletePrepilaUser(user) {
  return Boolean(user?.username && user?.email && user?.role && user?.id);
}

function renderPrepilaPrivateSession() {
  const user = getPrepilaCurrentUser();
  const userCard = document.querySelector('.user-card');
  const levelButton = document.querySelector('.admin-level[aria-label="Nível de acesso"]');

  if (userCard) {
    const avatar = userCard.querySelector('.mini-avatar');
    const name = userCard.querySelector('strong');
    const role = userCard.querySelector('small');

    if (avatar) avatar.textContent = user.avatar;
    if (name) name.textContent = user.displayName;
    if (role) role.textContent = user.role;
  }

  if (levelButton) {
    const levelText = levelButton.querySelector('span:nth-child(2)');

    if (levelText) {
      levelText.textContent = `Nível: ${user.role}`;
    }
  }
}

document.querySelectorAll('.logout-link').forEach((logoutLink) => {
  logoutLink.addEventListener('click', () => {
    sessionStorage.removeItem('prepila-auth-user');
    localStorage.removeItem('prepila-auth-user');
  });
});

renderPrepilaPrivateSession();
