const sidebar = document.querySelector('#privateSidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarBackdrop = document.querySelector('[data-close-sidebar]');
const notificationButton = document.querySelector('.notification-button');
const notificationModal = document.querySelector('#notificationModal');
const notificationCount = document.querySelector('.notification-count');
const closeNotificationButton = document.querySelector('[data-close-notification]');
const readNotificationButton = document.querySelector('[data-read-notification]');
const roleForm = document.querySelector('[data-new-role-form]');
const previewIcon = document.querySelector('[data-preview-icon]');
const previewName = document.querySelector('[data-preview-name]');
const previewDescription = document.querySelector('[data-preview-description]');
const previewScope = document.querySelector('[data-preview-scope]');
const previewPermissions = document.querySelector('[data-preview-permissions]');
const previewStatus = document.querySelector('[data-preview-status]');
const formStatus = document.querySelector('[data-role-form-status]');
const toast = document.querySelector('#adminToast');

const scopeLabels = {
  total: 'Acesso total',
  gestao: 'Gestão',
  operacao: 'Operação',
  leitura: 'Leitura',
};

const statusLabels = {
  ativo: 'Ativo',
  rascunho: 'Rascunho',
  inativo: 'Inativo',
};

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

function getCheckedPermissionsCount() {
  if (!roleForm) {
    return 0;
  }

  return roleForm.querySelectorAll('.permission-module input:checked').length;
}

function updatePreview() {
  if (!roleForm) {
    return;
  }

  const roleName = roleForm.elements.roleName.value.trim();
  const description = roleForm.elements.description.value.trim();
  const scope = roleForm.elements.scope.value;
  const status = roleForm.elements.status.value;

  if (previewIcon) {
    previewIcon.textContent = roleForm.elements.icon.value;
  }

  if (previewName) {
    previewName.textContent = roleName || 'Novo papel';
  }

  if (previewDescription) {
    previewDescription.textContent = description || 'Descrição pendente';
  }

  if (previewScope) {
    previewScope.textContent = scopeLabels[scope] || scope;
  }

  if (previewPermissions) {
    previewPermissions.textContent = getCheckedPermissionsCount();
  }

  if (previewStatus) {
    previewStatus.textContent = statusLabels[status] || status;
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

if (roleForm) {
  roleForm.addEventListener('input', updatePreview);
  roleForm.addEventListener('change', updatePreview);
  roleForm.addEventListener('reset', () => {
    window.setTimeout(() => {
      updatePreview();
      if (formStatus) {
        formStatus.textContent = '';
      }
    });
  });

  roleForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!roleForm.checkValidity()) {
      roleForm.reportValidity();
      return;
    }

    const roleName = roleForm.elements.roleName.value.trim();
    const checkedPermissions = getCheckedPermissionsCount();
    const permissionLevel = checkedPermissions >= 12 ? 'total' : checkedPermissions >= 8 ? 'editar' : checkedPermissions >= 4 ? 'ver' : 'nao';

    if (window.PrepilaData) {
      const roles = PrepilaData.getRoles();
      roles.unshift({
        id: crypto.randomUUID(),
        name: roleName,
        scope: roleForm.elements.scope.value,
        icon: roleForm.elements.icon.value,
        color: roleForm.elements.scope.value === 'total' ? 'admin' : roleForm.elements.scope.value === 'operacao' ? 'operator' : roleForm.elements.scope.value === 'gestao' ? 'manager' : 'viewer',
        description: roleForm.elements.description.value.trim(),
        users: 0,
        status: roleForm.elements.status.value,
        permissions: {
          users: roleForm.elements.usersView.checked ? permissionLevel : 'nao',
          contracts: roleForm.elements.contractsView.checked ? permissionLevel : 'nao',
          operations: roleForm.elements.operationsView.checked ? permissionLevel : 'nao',
          reports: roleForm.elements.reportsView.checked ? permissionLevel : 'nao',
          audit: roleForm.elements.reportsAudit.checked ? 'ver' : 'nao',
        },
      });
      PrepilaData.saveRoles(roles);
    }

    if (formStatus) {
      formStatus.textContent = `Papel ${roleName} criado com ${checkedPermissions} permissões.`;
    }

    showToast(`Papel ${roleName} criado com sucesso.`);
  });
}

updatePreview();
