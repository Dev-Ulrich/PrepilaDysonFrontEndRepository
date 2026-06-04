const menuButton = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('#menu-principal');
const loginForm = document.querySelector('#loginForm');
const userInput = document.querySelector('#userLogin');
const passwordInput = document.querySelector('#password');
const userError = document.querySelector('#userLoginError');
const passwordError = document.querySelector('#passwordError');
const feedback = document.querySelector('#formFeedback');
const showPasswordButton = document.querySelector('.show-password');
const rememberInput = document.querySelector('input[name="remember"]');
const forgotPasswordButton = document.querySelector('[data-open-forgot-password]');
const forgotPasswordModal = document.querySelector('#forgotPasswordModal');
const closeForgotPasswordButtons = document.querySelectorAll('[data-close-forgot-password]');

const users = [
  { username: 'admPrepilaDyson', password: 'PrepilaDyson2026', displayName: 'Administrador Prepila Dyson' },
  { username: 'Matheus Pereira', password: '569315', displayName: 'Matheus Pereira' },
  { username: 'Victor Ulrich', password: '568634', displayName: 'Victor Ulrich' },
  { username: 'Matheus Luca', password: '572228', displayName: 'Matheus Luca' },
  { username: 'Arthur da Silva', password: '571075', displayName: 'Arthur da Silva' },
  { username: 'Yasmin Capi', password: '571926', displayName: 'Yasmin Capi' },
  { username: 'Alexandre Carlos', password: '271280', displayName: 'Alexandre Carlos' }
];

function toggleMenu() {
  const isOpen = mainMenu.classList.toggle('active');
  menuButton.setAttribute('aria-expanded', String(isOpen));
}

function setFieldState(input, errorElement, message) {
  if (message) {
    input.classList.add('invalid');
    errorElement.textContent = message;
    return false;
  }

  input.classList.remove('invalid');
  errorElement.textContent = '';
  return true;
}

function validateUser() {
  const value = userInput.value.trim();

  if (!value) {
    return setFieldState(userInput, userError, 'Informe seu usuário.');
  }

  return setFieldState(userInput, userError, '');
}

function validatePassword() {
  const value = passwordInput.value.trim();

  if (!value) {
    return setFieldState(passwordInput, passwordError, 'Informe sua senha.');
  }

  if (value.length < 6) {
    return setFieldState(passwordInput, passwordError, 'A senha deve ter pelo menos 6 caracteres.');
  }

  return setFieldState(passwordInput, passwordError, '');
}

function handleLogin(event) {
  event.preventDefault();

  const isUserValid = validateUser();
  const isPasswordValid = validatePassword();

  if (!isUserValid || !isPasswordValid) {
    feedback.textContent = '';
    return;
  }

  const username = userInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();
  const authenticatedUser = users.find((user) => (
    user.username.toLowerCase() === username && user.password === password
  ));

  if (!authenticatedUser) {
    setFieldState(userInput, userError, 'Usuário ou senha inválidos.');
    setFieldState(passwordInput, passwordError, 'Confira os dados e tente novamente.');
    feedback.textContent = '';
    return;
  }

  const sessionData = {
    username: authenticatedUser.username,
    displayName: authenticatedUser.displayName,
    loggedAt: new Date().toISOString()
  };

  sessionStorage.setItem('prepila-auth-user', JSON.stringify(sessionData));

  if (rememberInput.checked) {
    localStorage.setItem('prepila-auth-user', JSON.stringify(sessionData));
  } else {
    localStorage.removeItem('prepila-auth-user');
  }

  feedback.textContent = `Login realizado. Bem-vindo(a), ${authenticatedUser.displayName}.`;

  window.setTimeout(() => {
    window.location.href = '/pages/private/dashboard/dashboard.html';
  }, 900);
}

function togglePasswordVisibility() {
  const isPassword = passwordInput.type === 'password';

  passwordInput.type = isPassword ? 'text' : 'password';
  showPasswordButton.textContent = isPassword ? '●' : '○';
  showPasswordButton.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
}

function openForgotPasswordModal() {
  if (!forgotPasswordModal) {
    return;
  }

  forgotPasswordModal.hidden = false;
  document.body.classList.add('modal-open');
  forgotPasswordModal.querySelector('[data-close-forgot-password]')?.focus();
}

function closeForgotPasswordModal() {
  if (!forgotPasswordModal) {
    return;
  }

  forgotPasswordModal.hidden = true;
  document.body.classList.remove('modal-open');
  forgotPasswordButton?.focus();
}

if (menuButton && mainMenu) {
  menuButton.addEventListener('click', toggleMenu);
}

if (forgotPasswordButton) {
  forgotPasswordButton.addEventListener('click', openForgotPasswordModal);
}

closeForgotPasswordButtons.forEach((button) => {
  button.addEventListener('click', closeForgotPasswordModal);
});

if (forgotPasswordModal) {
  forgotPasswordModal.addEventListener('click', (event) => {
    if (event.target === forgotPasswordModal) {
      closeForgotPasswordModal();
    }
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeForgotPasswordModal();
  }
});

loginForm.addEventListener('submit', handleLogin);
userInput.addEventListener('input', validateUser);
passwordInput.addEventListener('input', validatePassword);
showPasswordButton.addEventListener('click', togglePasswordVisibility);
