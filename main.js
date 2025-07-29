// Define routes
const routes = {
  '/': '<h2>🏠 Home Page</h2><p>Welcome to our Single Page App.</p>',
  '/about': '<h2>📖 About Page</h2><p>This is a simple SPA using vanilla JavaScript.</p>',
  '/contact': '<h2>📞 Contact Page</h2><p>Reach us at contact@example.com</p>'
};

// Render the page content
function render(path) {
  const app = document.getElementById('app');
  app.innerHTML = routes[path] || '<h2>404 - Page Not Found</h2>';
}

// Handle navigation
function navigate(event) {
  event.preventDefault();
  const path = event.target.getAttribute('href');
  window.history.pushState({}, '', path);
  render(path);
}

// Setup event listeners
function initRouter() {
  document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', navigate);
  });

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    render(window.location.pathname);
  });

  // Initial render
  render(window.location.pathname);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', initRouter);
