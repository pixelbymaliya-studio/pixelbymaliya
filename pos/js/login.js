// Authentication Controller for Pixel By Maliya POS
const AUTH_USER = 'pixelbymaliya.lk';
const AUTH_PASS = 'Admin123';

document.addEventListener('DOMContentLoaded', () => {
  checkAuthSession();
});

function checkAuthSession() {
  const isLoggedIn = sessionStorage.getItem('pixel_pos_logged_in');
  const loginScreen = document.getElementById('login-screen');
  const appContainer = document.getElementById('main-app-container');

  if (isLoggedIn === 'true') {
    if (loginScreen) loginScreen.classList.add('hidden');
    if (appContainer) appContainer.classList.remove('hidden');
    // Ensure dashboard data is loaded
    if (typeof switchTab === 'function') {
      switchTab(activeTab || 'dashboard');
    }
  } else {
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (appContainer) appContainer.classList.add('hidden');
  }
}

function handleLoginSubmit(event) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }

  const userInput = document.getElementById('login-username')?.value || '';
  const passInput = document.getElementById('login-password')?.value || '';

  const user = userInput.trim();
  const pass = passInput.trim();

  const errorMsg = document.getElementById('login-error-msg');

  // Debug log to console
  console.log('Login attempt:', { username: user, password: pass });

  if (user === AUTH_USER && pass === AUTH_PASS) {
    console.log('✅ Authentication successful!');
    if (errorMsg) errorMsg.classList.add('hidden');
    sessionStorage.setItem('pixel_pos_logged_in', 'true');
    checkAuthSession();
  } else {
    console.warn('❌ Authentication failed: Invalid credentials.');
    if (errorMsg) {
      errorMsg.innerText = 'Invalid Username or Password';
      errorMsg.classList.remove('hidden');
    }
  }
}

function handleLogout() {
  sessionStorage.removeItem('pixel_pos_logged_in');
  checkAuthSession();
}
