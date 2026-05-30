const menuButton = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('#menu-principal');
const loginForm = document.querySelector('#loginForm');
const userInput = document.querySelector('#userLogin');
const passwordInput = document.querySelector('#password');
const userError = document.querySelector('#userLoginError');
const passwordError = document.querySelector('#passwordError');
const feedback = document.querySelector('#formFeedback');
const showPasswordButton = document.querySelector('.show-password');

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
    return setFieldState(userInput, userError, 'Informe seu e-mail ou ID de usuário.');
  }

  if (value.includes('@')) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      return setFieldState(userInput, userError, 'Digite um e-mail válido.');
    }
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

  feedback.textContent = 'Login validado. Redirecionando para o painel operacional...';

  window.setTimeout(() => {
    feedback.textContent = 'Acesso simulado com sucesso. Integre esta tela ao backend futuramente.';
  }, 900);
}

function togglePasswordVisibility() {
  const isPassword = passwordInput.type === 'password';

  passwordInput.type = isPassword ? 'text' : 'password';
  showPasswordButton.textContent = isPassword ? '●' : '○';
  showPasswordButton.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
}

menuButton.addEventListener('click', toggleMenu);
loginForm.addEventListener('submit', handleLogin);
userInput.addEventListener('input', validateUser);
passwordInput.addEventListener('input', validatePassword);
showPasswordButton.addEventListener('click', togglePasswordVisibility);