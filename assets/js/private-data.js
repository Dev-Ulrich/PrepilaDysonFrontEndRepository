const PrepilaData = (() => {
  const storageKey = 'prepila-private-data-v1';

  const seeds = {
    users: [
      { id: 'user-1', name: 'Victor Ulrich', email: 'victor.ulrich@fiap.com.br', role: 'administrador', status: 'ativo', lastAccess: '06/06/2026 14:32', emoji: '👨‍💼', isCurrentUser: true, phone: '' },
      { id: 'user-2', name: 'Mariana Santos', email: 'mariana.santos@fiap.com.br', role: 'gerente', status: 'ativo', lastAccess: '06/06/2026 11:08', emoji: '👩‍💼', isCurrentUser: false, phone: '' },
      { id: 'user-3', name: 'João Pereira', email: 'joao.pereira@fiap.com.br', role: 'analista', status: 'ativo', lastAccess: '06/06/2026 09:15', emoji: '👨‍💻', isCurrentUser: false, phone: '' },
      { id: 'user-4', name: 'Renata Lima', email: 'renata.lima@fiap.com.br', role: 'analista', status: 'ativo', lastAccess: '05/06/2026 16:20', emoji: '👩‍🔬', isCurrentUser: false, phone: '' },
      { id: 'user-5', name: 'Lucas Rocha', email: 'lucas.rocha@fiap.com.br', role: 'operador', status: 'ativo', lastAccess: '05/06/2026 08:45', emoji: '👨‍🔧', isCurrentUser: false, phone: '' },
      { id: 'user-6', name: 'Carlos Mendes', email: 'carlos.mendes@fiap.com.br', role: 'visualizador', status: 'inativo', lastAccess: '02/06/2026 10:30', emoji: '👨‍🚀', isCurrentUser: false, phone: '' },
      { id: 'user-7', name: 'Juliana Costa', email: 'juliana.costa@fiap.com.br', role: 'operador', status: 'ativo', lastAccess: '01/06/2026 14:10', emoji: '👩‍💻', isCurrentUser: false, phone: '' },
      { id: 'user-8', name: 'Pedro Albuquerque', email: 'pedro.albuquerque@fiap.com.br', role: 'visualizador', status: 'inativo', lastAccess: '28/05/2026 09:22', emoji: '🧑‍💼', isCurrentUser: false, phone: '' },
      { id: 'user-9', name: 'Ana Martins', email: 'ana.martins@fiap.com.br', role: 'administrador', status: 'ativo', lastAccess: '27/05/2026 18:42', emoji: '👩‍💼', isCurrentUser: false, phone: '' },
      { id: 'user-10', name: 'Bruno Freitas', email: 'bruno.freitas@fiap.com.br', role: 'gerente', status: 'ativo', lastAccess: '27/05/2026 15:18', emoji: '👨‍💼', isCurrentUser: false, phone: '' },
      { id: 'user-11', name: 'Camila Nogueira', email: 'camila.nogueira@fiap.com.br', role: 'analista', status: 'ativo', lastAccess: '26/05/2026 11:31', emoji: '👩‍💻', isCurrentUser: false, phone: '' },
      { id: 'user-12', name: 'Diego Ramos', email: 'diego.ramos@fiap.com.br', role: 'operador', status: 'ativo', lastAccess: '26/05/2026 09:07', emoji: '👨‍🔧', isCurrentUser: false, phone: '' },
      { id: 'user-13', name: 'Elisa Carvalho', email: 'elisa.carvalho@fiap.com.br', role: 'visualizador', status: 'inativo', lastAccess: '25/05/2026 14:52', emoji: '👁️', isCurrentUser: false, phone: '' },
      { id: 'user-14', name: 'Fabio Moreira', email: 'fabio.moreira@fiap.com.br', role: 'operador', status: 'ativo', lastAccess: '25/05/2026 08:25', emoji: '👨‍🚀', isCurrentUser: false, phone: '' },
      { id: 'user-15', name: 'Gabriela Torres', email: 'gabriela.torres@fiap.com.br', role: 'analista', status: 'ativo', lastAccess: '24/05/2026 17:03', emoji: '👩‍🔬', isCurrentUser: false, phone: '' },
      { id: 'user-16', name: 'Henrique Lopes', email: 'henrique.lopes@fiap.com.br', role: 'gerente', status: 'ativo', lastAccess: '24/05/2026 10:44', emoji: '🧑‍💼', isCurrentUser: false, phone: '' },
      { id: 'user-17', name: 'Isabela Duarte', email: 'isabela.duarte@fiap.com.br', role: 'visualizador', status: 'inativo', lastAccess: '23/05/2026 13:10', emoji: '👩‍💼', isCurrentUser: false, phone: '' },
      { id: 'user-18', name: 'Marcelo Pires', email: 'marcelo.pires@fiap.com.br', role: 'operador', status: 'ativo', lastAccess: '23/05/2026 09:58', emoji: '👨‍🔧', isCurrentUser: false, phone: '' },
      { id: 'user-19', name: 'Natalia Azevedo', email: 'natalia.azevedo@fiap.com.br', role: 'analista', status: 'ativo', lastAccess: '22/05/2026 16:19', emoji: '👩‍💻', isCurrentUser: false, phone: '' },
      { id: 'user-20', name: 'Otavio Campos', email: 'otavio.campos@fiap.com.br', role: 'visualizador', status: 'ativo', lastAccess: '22/05/2026 12:02', emoji: '👨‍💼', isCurrentUser: false, phone: '' },
      { id: 'user-21', name: 'Patricia Barros', email: 'patricia.barros@fiap.com.br', role: 'gerente', status: 'ativo', lastAccess: '21/05/2026 18:36', emoji: '👩‍💼', isCurrentUser: false, phone: '' },
      { id: 'user-22', name: 'Rafael Gomes', email: 'rafael.gomes@fiap.com.br', role: 'operador', status: 'ativo', lastAccess: '21/05/2026 07:41', emoji: '👨‍🚀', isCurrentUser: false, phone: '' },
      { id: 'user-23', name: 'Sofia Ribeiro', email: 'sofia.ribeiro@fiap.com.br', role: 'analista', status: 'ativo', lastAccess: '20/05/2026 15:29', emoji: '👩‍🔬', isCurrentUser: false, phone: '' },
      { id: 'user-24', name: 'Thiago Melo', email: 'thiago.melo@fiap.com.br', role: 'visualizador', status: 'inativo', lastAccess: '20/05/2026 10:05', emoji: '🧑‍💼', isCurrentUser: false, phone: '' },
      { id: 'user-25', name: 'Valeria Reis', email: 'valeria.reis@fiap.com.br', role: 'administrador', status: 'ativo', lastAccess: '19/05/2026 17:50', emoji: '👩‍💼', isCurrentUser: false, phone: '' },
      { id: 'user-26', name: 'William Castro', email: 'william.castro@fiap.com.br', role: 'operador', status: 'ativo', lastAccess: '19/05/2026 08:17', emoji: '👨‍🔧', isCurrentUser: false, phone: '' },
      { id: 'user-27', name: 'Yuri Fernandes', email: 'yuri.fernandes@fiap.com.br', role: 'analista', status: 'ativo', lastAccess: '18/05/2026 14:09', emoji: '👨‍💻', isCurrentUser: false, phone: '' },
      { id: 'user-28', name: 'Livia Moraes', email: 'livia.moraes@fiap.com.br', role: 'visualizador', status: 'ativo', lastAccess: '18/05/2026 11:26', emoji: '👩‍💻', isCurrentUser: false, phone: '' },
    ],
    roles: [
      { id: 'role-admin', name: 'Administradores', scope: 'total', icon: '👥', color: 'admin', description: 'Acesso total ao sistema, usuários, contratos e auditoria.', users: 3, status: 'ativo', permissions: { users: 'total', contracts: 'total', operations: 'total', reports: 'total', audit: 'total' } },
      { id: 'role-manager', name: 'Gerentes', scope: 'gestao', icon: '👥', color: 'manager', description: 'Gerenciam equipes, contratos e revisão de permissões.', users: 5, status: 'ativo', permissions: { users: 'editar', contracts: 'editar', operations: 'ver', reports: 'exportar', audit: 'ver' } },
      { id: 'role-analyst', name: 'Analistas', scope: 'gestao', icon: '📊', color: 'analyst', description: 'Acessam relatórios, dados energéticos e exportações.', users: 8, status: 'ativo', permissions: { users: 'ver', contracts: 'ver', operations: 'ver', reports: 'exportar', audit: 'ver' } },
      { id: 'role-operator', name: 'Operadores', scope: 'operacao', icon: '⚙️', color: 'operator', description: 'Executam operações, monitoramento e acompanhamento técnico.', users: 7, status: 'ativo', permissions: { users: 'ver', contracts: 'ver', operations: 'editar', reports: 'ver', audit: 'nao' } },
      { id: 'role-viewer', name: 'Visualizadores', scope: 'leitura', icon: '👁️', color: 'viewer', description: 'Consultam dados, dashboards e relatórios sem editar.', users: 5, status: 'ativo', permissions: { users: 'ver', contracts: 'ver', operations: 'ver', reports: 'ver', audit: 'nao' } },
    ],
    contracts: [
      { id: 'contract-esa', acronym: 'ESA', organization: 'European Space Agency', owner: 'Mariana Santos', email: 'mariana.santos@fiap.com.br', plan: 'SaaS anual', status: 'Ativo', value: 2200000, billing: 'Anual', startDate: '2026-01-01', endDate: '2026-12-31', sla: '99.9% disponibilidade', renewal: 'Automática', notes: 'Contrato estratégico para operação europeia.' },
      { id: 'contract-jaxa', acronym: 'JAXA', organization: 'Japan Aerospace Exploration Agency', owner: 'João Pereira', email: 'joao.pereira@fiap.com.br', plan: 'Monitoramento dedicado', status: 'Pendente', value: 1700000, billing: 'Anual', startDate: '2026-03-15', endDate: '2027-03-14', sla: '99.5% disponibilidade', renewal: 'Manual', notes: 'Ativação pendente de validação técnica.' },
      { id: 'contract-nasa', acronym: 'NASA', organization: 'National Aeronautics and Space Administration', owner: 'Victor Ulrich', email: 'victor.ulrich@fiap.com.br', plan: 'SaaS anual', status: 'Ativo', value: 3200000, billing: 'Anual', startDate: '2026-02-01', endDate: '2027-01-31', sla: '99.9% disponibilidade', renewal: 'Automática', notes: 'Monitoramento premium.' },
      { id: 'contract-spacex', acronym: 'SPX', organization: 'SpaceX', owner: 'Lucas Rocha', email: 'lucas.rocha@fiap.com.br', plan: 'SaaS mensal', status: 'Suspenso', value: 450000, billing: 'Mensal', startDate: '2026-04-01', endDate: '2026-10-01', sla: '99.5% disponibilidade', renewal: 'Manual', notes: 'Suspenso para revisão comercial.' },
    ],
    operations: [
      { id: 'op-1', name: 'Transferência de carga', type: 'transfer', station: 'EN-01 → EN-03', status: 'andamento', start: '2026-06-06T14:20', end: '2026-06-06T15:30', owner: 'Carlos M.', person: '👨‍💼' },
      { id: 'op-2', name: 'Ajuste orbital', type: 'orbital', station: '205-07', status: 'pendente', start: '2026-06-06T13:50', end: '2026-06-06T15:00', owner: 'Mariana S.', person: '👩‍💼' },
      { id: 'op-3', name: 'Redistribuição de energia', type: 'energy', station: 'Setor Sul', status: 'concluida', start: '2026-06-06T12:10', end: '2026-06-06T12:41', owner: 'João P.', person: '👨‍🚀' },
      { id: 'op-4', name: 'Manutenção preventiva', type: 'maintenance', station: 'EN-04', status: 'pendente', start: '2026-06-06T11:20', end: '2026-06-06T14:00', owner: 'Lucas R.', person: '🧑‍🔧' },
      { id: 'op-5', name: 'Calibração de sensores', type: 'calibration', station: 'EN-08', status: 'concluida', start: '2026-06-06T09:05', end: '2026-06-06T09:15', owner: 'Renata L.', person: '👩‍💻' },
    ],
    alerts: [],
    recommendations: [],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readStore() {
    const raw = localStorage.getItem(storageKey);

    if (!raw) {
      const seeded = clone(seeds);
      localStorage.setItem(storageKey, JSON.stringify(seeded));
      return seeded;
    }

    try {
      return { ...clone(seeds), ...JSON.parse(raw) };
    } catch {
      const seeded = clone(seeds);
      localStorage.setItem(storageKey, JSON.stringify(seeded));
      return seeded;
    }
  }

  function writeStore(nextStore) {
    localStorage.setItem(storageKey, JSON.stringify(nextStore));
  }

  function getCollection(name) {
    return clone(readStore()[name] || []);
  }

  function saveCollection(name, items) {
    const store = readStore();
    store[name] = clone(items);
    writeStore(store);
    window.dispatchEvent(new CustomEvent('prepila:data-updated', { detail: { collection: name } }));
  }

  function downloadFile(filename, content, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return {
    getUsers: () => getCollection('users'),
    saveUsers: (items) => saveCollection('users', items),
    getRoles: () => getCollection('roles'),
    saveRoles: (items) => saveCollection('roles', items),
    getContracts: () => getCollection('contracts'),
    saveContracts: (items) => saveCollection('contracts', items),
    getOperations: () => getCollection('operations'),
    saveOperations: (items) => saveCollection('operations', items),
    getAlerts: () => getCollection('alerts'),
    saveAlerts: (items) => saveCollection('alerts', items),
    getRecommendations: () => getCollection('recommendations'),
    saveRecommendations: (items) => saveCollection('recommendations', items),
    resetSeedData: () => writeStore(clone(seeds)),
    downloadFile,
  };
})();
