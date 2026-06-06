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
const closeUserModalButtons = document.querySelectorAll('[data-close-user-modal]');
const userForm = document.querySelector('[data-user-form]');
const userModalTitle = document.querySelector('[data-user-modal-title]');
const userModalDescription = document.querySelector('[data-user-modal-description]');
const searchInput = document.querySelector('[data-user-search]');
const roleFilter = document.querySelector('[data-role-filter]');
const statusFilter = document.querySelector('[data-status-filter]');
const usersTable = document.querySelector('.users-table');
const userHead = document.querySelector('.user-head');
const userCount = document.querySelector('[data-user-count]');
const pagination = document.querySelector('.pagination');
const pageSizeSelect = document.querySelector('[data-page-size]');
const backupButton = document.querySelector('[data-backup-action]');
const activeUsersMetric = document.querySelector('[data-active-users]');
const toast = document.querySelector('#adminToast');

const roleConfig = {
  administrador: { label: 'Administrador', className: 'admin' },
  gerente: { label: 'Gerente', className: 'manager' },
  analista: { label: 'Analista', className: 'analyst' },
  operador: { label: 'Operador', className: 'operator' },
  visualizador: { label: 'Visualizador', className: 'viewer' },
};

const userEmojis = [
  '👨‍💼',
  '👩‍💼',
  '👨‍💻',
  '👩‍🔬',
  '👨‍🔧',
  '👨‍🚀',
  '👩‍💻',
  '🧑‍💼',
];

let currentPage = 1;
let users = window.PrepilaData ? PrepilaData.getUsers() : readInitialUsers();

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

function readInitialUsers() {
  const rows = [...document.querySelectorAll('[data-user-row]')];
  const baseUsers = rows.map((row, index) => {
    const cells = row.querySelectorAll('[role="cell"]');
    const name = cells[0]?.querySelector('b')?.textContent.trim() || `Usuário ${index + 1}`;
    const emoji = cells[0]?.querySelector('.user-avatar')?.textContent.trim() || userEmojis[index % userEmojis.length];

    return {
      id: crypto.randomUUID(),
      name,
      email: cells[1]?.textContent.trim() || '',
      role: row.dataset.role || 'visualizador',
      status: row.dataset.status || 'ativo',
      lastAccess: cells[4]?.textContent.trim() || 'Nunca',
      emoji,
      isCurrentUser: Boolean(cells[0]?.querySelector('em')),
      phone: '',
    };
  });

  const extraUsers = [
    ['Ana Martins', 'ana.martins@fiap.com.br', 'administrador', 'ativo', '27/05/2026 18:42'],
    ['Bruno Freitas', 'bruno.freitas@fiap.com.br', 'gerente', 'ativo', '27/05/2026 15:18'],
    ['Camila Nogueira', 'camila.nogueira@fiap.com.br', 'analista', 'ativo', '26/05/2026 11:31'],
    ['Diego Ramos', 'diego.ramos@fiap.com.br', 'operador', 'ativo', '26/05/2026 09:07'],
    ['Elisa Carvalho', 'elisa.carvalho@fiap.com.br', 'visualizador', 'inativo', '25/05/2026 14:52'],
    ['Fabio Moreira', 'fabio.moreira@fiap.com.br', 'operador', 'ativo', '25/05/2026 08:25'],
    ['Gabriela Torres', 'gabriela.torres@fiap.com.br', 'analista', 'ativo', '24/05/2026 17:03'],
    ['Henrique Lopes', 'henrique.lopes@fiap.com.br', 'gerente', 'ativo', '24/05/2026 10:44'],
    ['Isabela Duarte', 'isabela.duarte@fiap.com.br', 'visualizador', 'inativo', '23/05/2026 13:10'],
    ['Marcelo Pires', 'marcelo.pires@fiap.com.br', 'operador', 'ativo', '23/05/2026 09:58'],
    ['Natalia Azevedo', 'natalia.azevedo@fiap.com.br', 'analista', 'ativo', '22/05/2026 16:19'],
    ['Otavio Campos', 'otavio.campos@fiap.com.br', 'visualizador', 'ativo', '22/05/2026 12:02'],
    ['Patricia Barros', 'patricia.barros@fiap.com.br', 'gerente', 'ativo', '21/05/2026 18:36'],
    ['Rafael Gomes', 'rafael.gomes@fiap.com.br', 'operador', 'ativo', '21/05/2026 07:41'],
    ['Sofia Ribeiro', 'sofia.ribeiro@fiap.com.br', 'analista', 'ativo', '20/05/2026 15:29'],
    ['Thiago Melo', 'thiago.melo@fiap.com.br', 'visualizador', 'inativo', '20/05/2026 10:05'],
    ['Valeria Reis', 'valeria.reis@fiap.com.br', 'administrador', 'ativo', '19/05/2026 17:50'],
    ['William Castro', 'william.castro@fiap.com.br', 'operador', 'ativo', '19/05/2026 08:17'],
    ['Yuri Fernandes', 'yuri.fernandes@fiap.com.br', 'analista', 'ativo', '18/05/2026 14:09'],
    ['Livia Moraes', 'livia.moraes@fiap.com.br', 'visualizador', 'ativo', '18/05/2026 11:26'],
  ].map(([name, email, role, status, lastAccess], index) => ({
    id: crypto.randomUUID(),
    name,
    email,
    role,
    status,
    lastAccess,
    emoji: userEmojis[(index + baseUsers.length) % userEmojis.length],
    isCurrentUser: false,
    phone: '',
  }));

  return [...baseUsers, ...extraUsers];
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

function getFilteredUsers() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const role = roleFilter ? roleFilter.value : 'todos';
  const status = statusFilter ? statusFilter.value : 'todos';

  return users.filter((user) => {
    const searchable = `${user.name} ${user.email} ${roleConfig[user.role]?.label || user.role}`.toLowerCase();
    const matchesSearch = searchable.includes(query);
    const matchesRole = role === 'todos' || user.role === role;
    const matchesStatus = status === 'todos' || user.status === status;

    return matchesSearch && matchesRole && matchesStatus;
  });
}

function createUserRow(user) {
  const role = roleConfig[user.role] || roleConfig.visualizador;
  const statusLabel = user.status === 'ativo' ? 'Ativo' : 'Inativo';
  const statusClass = user.status === 'ativo' ? 'active' : 'inactive';
  const currentUserChip = user.isCurrentUser ? '<em>Você</em>' : '';
  const deleteButton = user.isCurrentUser
    ? ''
    : `<button class="icon-button danger-action" type="button" aria-label="Excluir ${escapeHtml(user.name)}" data-delete-user="${user.id}">🗑</button>`;

  return `
    <div class="user-row" role="row" data-user-row data-role="${user.role}" data-status="${user.status}" data-id="${user.id}">
      <span role="cell"><span class="user-avatar" aria-hidden="true">${user.emoji}</span><b>${escapeHtml(user.name)}</b>${currentUserChip}</span>
      <span role="cell">${escapeHtml(user.email)}</span>
      <span role="cell"><strong class="role-chip ${role.className}">${role.label}</strong></span>
      <span role="cell"><strong class="status-label ${statusClass}">● ${statusLabel}</strong></span>
      <span role="cell">${escapeHtml(user.lastAccess)}</span>
      <span role="cell"><button class="icon-button" type="button" aria-label="Editar ${escapeHtml(user.name)}" data-edit-user="${user.id}">✎</button>${deleteButton}</span>
    </div>
  `;
}

function renderPagination(totalPages) {
  if (!pagination) {
    return;
  }

  const pageButtons = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button class="${page === currentPage ? 'active' : ''}" type="button" data-page="${page}" aria-label="Página ${page}">${page}</button>`;
  }).join('');

  pagination.innerHTML = `
    <button type="button" data-page="prev" ${currentPage === 1 ? 'disabled' : ''} aria-label="Página anterior">‹</button>
    ${pageButtons}
    <button type="button" data-page="next" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Próxima página">›</button>
  `;
}

function updateMetrics() {
  const activeCount = users.filter((user) => user.status === 'ativo').length;

  if (activeUsersMetric) {
    activeUsersMetric.textContent = activeCount;
  }
}

function renderUsers() {
  if (!usersTable || !userHead) {
    return;
  }

  const filteredUsers = getFilteredUsers();
  const pageSize = Number(pageSizeSelect?.value || 10);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * pageSize;
  const visibleUsers = filteredUsers.slice(start, start + pageSize);

  usersTable.innerHTML = '';
  usersTable.append(userHead);
  usersTable.insertAdjacentHTML('beforeend', visibleUsers.map(createUserRow).join(''));

  if (userCount) {
    const firstVisible = filteredUsers.length ? start + 1 : 0;
    const lastVisible = Math.min(start + pageSize, filteredUsers.length);
    userCount.textContent = `Exibindo ${firstVisible} a ${lastVisible} de ${filteredUsers.length} usuários`;
  }

  renderPagination(totalPages);
  updateMetrics();
}

function resetUserForm(mode = 'create') {
  if (!userForm) {
    return;
  }

  userForm.reset();
  userForm.elements.userId.value = '';
  userForm.elements.password.required = mode === 'create';

  if (userModalTitle) {
    userModalTitle.textContent = mode === 'edit' ? 'Editar usuário' : 'Novo usuário';
  }

  if (userModalDescription) {
    userModalDescription.textContent = mode === 'edit'
      ? 'Atualize os dados, papel e status do usuário.'
      : 'Cadastre um usuário e defina o acesso inicial.';
  }
}

function openCreateUser() {
  resetUserForm('create');
  openModal(userModal, userForm?.elements.name);
}

function openEditUser(userId) {
  const user = users.find((item) => item.id === userId);

  if (!user || !userForm) {
    return;
  }

  resetUserForm('edit');
  userForm.elements.userId.value = user.id;
  userForm.elements.name.value = user.name;
  userForm.elements.email.value = user.email;
  userForm.elements.role.value = user.role;
  userForm.elements.status.value = user.status;
  userForm.elements.phone.value = user.phone || '';
  userForm.elements.password.value = '';
  openModal(userModal, userForm.elements.name);
}

function saveUser(event) {
  event.preventDefault();

  if (!userForm.checkValidity()) {
    userForm.reportValidity();
    return;
  }

  const formData = new FormData(userForm);
  const userId = formData.get('userId');
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const duplicatedEmail = users.some((user) => user.email === email && user.id !== userId);

  if (duplicatedEmail) {
    showToast('Já existe um usuário cadastrado com este e-mail.');
    return;
  }

  if (userId) {
    users = users.map((user) => user.id === userId
      ? {
        ...user,
        name,
        email,
        role: formData.get('role'),
        status: formData.get('status'),
        phone: formData.get('phone').trim(),
      }
      : user);
    if (window.PrepilaData) PrepilaData.saveUsers(users);
    showToast(`Usuário ${name} atualizado.`);
  } else {
    users.unshift({
      id: crypto.randomUUID(),
      name,
      email,
      role: formData.get('role'),
      status: formData.get('status'),
      phone: formData.get('phone').trim(),
      lastAccess: 'Convite enviado',
      emoji: userEmojis[users.length % userEmojis.length],
      isCurrentUser: false,
    });
    if (window.PrepilaData) PrepilaData.saveUsers(users);
    currentPage = 1;
    showToast(`Usuário ${name} criado com sucesso.`);
  }

  closeModal(userModal);
  renderUsers();
}

function deleteUser(userId) {
  const user = users.find((item) => item.id === userId);

  if (!user) {
    return;
  }

  const shouldDelete = window.confirm(`Excluir ${user.name}? Esta ação remove o acesso da tabela.`);

  if (!shouldDelete) {
    return;
  }

  users = users.filter((item) => item.id !== userId);
  if (window.PrepilaData) PrepilaData.saveUsers(users);
  showToast(`Usuário ${user.name} excluído.`);
  renderUsers();
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
    showToast('Notificações marcadas como lidas.');
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
  openUserModalButton.addEventListener('click', openCreateUser);
}

closeUserModalButtons.forEach((button) => {
  button.addEventListener('click', () => {
    closeModal(userModal);
  });
});

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

  control.addEventListener('input', () => {
    currentPage = 1;
    renderUsers();
  });
  control.addEventListener('change', () => {
    currentPage = 1;
    renderUsers();
  });
});

if (pageSizeSelect) {
  pageSizeSelect.addEventListener('change', () => {
    currentPage = 1;
    renderUsers();
  });
}

if (pagination) {
  pagination.addEventListener('click', (event) => {
    const button = event.target.closest('[data-page]');

    if (!button || button.disabled) {
      return;
    }

    const filteredUsers = getFilteredUsers();
    const pageSize = Number(pageSizeSelect?.value || 10);
    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
    const action = button.dataset.page;

    if (action === 'prev') {
      currentPage = Math.max(1, currentPage - 1);
    } else if (action === 'next') {
      currentPage = Math.min(totalPages, currentPage + 1);
    } else {
      currentPage = Number(action);
    }

    renderUsers();
  });
}

if (usersTable) {
  usersTable.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-user]');
    const deleteButton = event.target.closest('[data-delete-user]');

    if (editButton) {
      openEditUser(editButton.dataset.editUser);
    }

    if (deleteButton) {
      deleteUser(deleteButton.dataset.deleteUser);
    }
  });
}

if (userForm) {
  userForm.addEventListener('submit', saveUser);
}

settingsActionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(button.dataset.settingsAction);
    closeModal(settingsModal);
  });
});

if (backupButton) {
  backupButton.addEventListener('click', () => {
    showToast('Rotina de backup e segurança iniciada.');
  });
}

renderUsers();
