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
const roleList = document.querySelector('[data-role-list]');
const matrixTable = document.querySelector('.admin-permissions-table');
const emptyRoles = document.querySelector('[data-empty-roles]');
const syncButton = document.querySelector('[data-sync-permissions]');
const exportButton = document.querySelector('[data-export-permissions]');
const toast = document.querySelector('#adminToast');

const scopeLabels = {
  total: 'Acesso total',
  gestao: 'Gestão',
  operacao: 'Operação',
  leitura: 'Leitura',
};

let roles = window.PrepilaData ? PrepilaData.getRoles() : [];

function setSidebarState(isOpen) {
  document.body.classList.toggle('sidebar-open', isOpen);
  if (sidebarToggle) sidebarToggle.setAttribute('aria-expanded', String(isOpen));
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

function openModal(modal, focusTarget) {
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  focusTarget?.focus();
}

function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
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

function permissionLabel(value) {
  const labels = {
    total: '✅ Total',
    editar: '✅ Editar',
    exportar: '✅ Exportar',
    ver: '👁️ Ver',
    nao: '🚫 Não',
  };
  return labels[value] || '🚫 Não';
}

function getFilteredRoles() {
  const query = roleSearch ? roleSearch.value.trim().toLowerCase() : '';
  const scope = scopeFilter ? scopeFilter.value : 'todos';

  return roles.filter((role) => {
    const matchesSearch = `${role.name} ${role.description}`.toLowerCase().includes(query);
    const matchesScope = scope === 'todos' || role.scope === scope;
    return matchesSearch && matchesScope;
  });
}

function renderRoleList() {
  if (!roleList) return;
  const filteredRoles = getFilteredRoles();

  roleList.innerHTML = filteredRoles.map((role) => `
    <article data-role-item data-scope="${role.scope}">
      <span class="role-icon ${role.color || 'viewer'}">${role.icon || '👥'}</span>
      <div>
        <strong>${escapeHtml(role.name)}</strong>
        <small>${escapeHtml(role.description)} · ${scopeLabels[role.scope] || role.scope}</small>
      </div>
      <b>${role.users || 0}</b>
      <span class="role-actions">
        <button class="icon-button" type="button" aria-label="Editar ${escapeHtml(role.name)}" data-edit-role="${role.id}">✎</button>
        <button class="icon-button danger-action" type="button" aria-label="Excluir ${escapeHtml(role.name)}" data-delete-role="${role.id}">🗑</button>
      </span>
    </article>
  `).join('');

  if (emptyRoles) emptyRoles.hidden = filteredRoles.length > 0;
}

function renderMatrix() {
  if (!matrixTable) return;

  matrixTable.innerHTML = `
    <div class="permission-row permission-head" role="row">
      <span role="columnheader">Papel</span>
      <span role="columnheader">Usuários</span>
      <span role="columnheader">Contratos</span>
      <span role="columnheader">Operações</span>
      <span role="columnheader">Relatórios</span>
      <span role="columnheader">Auditoria</span>
    </div>
    ${roles.map((role) => `
      <div class="permission-row" role="row">
        <span role="cell">${escapeHtml(role.name)}</span>
        <span>${permissionLabel(role.permissions?.users)}</span>
        <span>${permissionLabel(role.permissions?.contracts)}</span>
        <span>${permissionLabel(role.permissions?.operations)}</span>
        <span>${permissionLabel(role.permissions?.reports)}</span>
        <span>${permissionLabel(role.permissions?.audit)}</span>
      </div>
    `).join('')}
  `;
}

function renderRoles() {
  renderRoleList();
  renderMatrix();
}

function saveRoles() {
  if (window.PrepilaData) PrepilaData.saveRoles(roles);
}

function editRole(roleId) {
  const role = roles.find((item) => item.id === roleId);
  if (!role) return;

  const nextName = window.prompt('Nome do papel:', role.name);
  if (!nextName) return;

  const nextDescription = window.prompt('Descrição do papel:', role.description) || role.description;
  roles = roles.map((item) => item.id === roleId ? { ...item, name: nextName.trim(), description: nextDescription.trim() } : item);
  saveRoles();
  renderRoles();
  showToast(`Papel ${nextName.trim()} atualizado.`);
}

function deleteRole(roleId) {
  const role = roles.find((item) => item.id === roleId);
  if (!role) return;

  if (!window.confirm(`Excluir o papel ${role.name}?`)) return;

  roles = roles.filter((item) => item.id !== roleId);
  saveRoles();
  renderRoles();
  showToast(`Papel ${role.name} excluído.`);
}

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => setSidebarState(!document.body.classList.contains('sidebar-open')));
}

if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', () => setSidebarState(false));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setSidebarState(false);
    closeModal(notificationModal);
  }
});

if (notificationButton) notificationButton.addEventListener('click', () => openModal(notificationModal, closeNotificationButton));
if (closeNotificationButton) closeNotificationButton.addEventListener('click', () => closeModal(notificationModal));

if (notificationModal) {
  notificationModal.addEventListener('click', (event) => {
    if (event.target === notificationModal) closeModal(notificationModal);
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
  if (!control) return;
  control.addEventListener('input', renderRoleList);
  control.addEventListener('change', renderRoleList);
});

if (roleList) {
  roleList.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-role]');
    const deleteButton = event.target.closest('[data-delete-role]');
    if (editButton) editRole(editButton.dataset.editRole);
    if (deleteButton) deleteRole(deleteButton.dataset.deleteRole);
  });
}

if (syncButton) {
  syncButton.addEventListener('click', () => {
    roles = window.PrepilaData ? PrepilaData.getRoles() : roles;
    renderRoles();
    showToast('Permissões sincronizadas com sucesso.');
  });
}

if (exportButton) {
  exportButton.addEventListener('click', () => {
    const content = JSON.stringify(roles, null, 2);
    if (window.PrepilaData) PrepilaData.downloadFile('papeis-permissoes.json', content);
    showToast('Matriz de permissões exportada.');
  });
}

renderRoles();
