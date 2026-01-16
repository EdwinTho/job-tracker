/**
 * Theme Module
 * Handles dark/light mode toggle with localStorage persistence and system preference support
 */

const Theme = {
  STORAGE_KEY: 'jobTrackerTheme',
  DARK: 'dark',
  LIGHT: 'light',

  /**
   * Initialize theme module
   */
  init() {
    this.applyInitialTheme();
    this.renderToggleButton();
  },

  /**
   * Get saved theme from localStorage or system preference
   */
  getSavedTheme() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.DARK;
    }
    return this.LIGHT;
  },

  /**
   * Apply the initial theme on page load
   */
  applyInitialTheme() {
    const theme = this.getSavedTheme();
    this.setTheme(theme, false);
  },

  /**
   * Set the theme and optionally save to localStorage
   */
  setTheme(theme, save = true) {
    if (theme === this.DARK) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    if (save) {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
    this.updateButtonIcon();
  },

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? this.DARK : this.LIGHT;
  },

  /**
   * Toggle between dark and light themes
   */
  toggle() {
    const current = this.getCurrentTheme();
    const newTheme = current === this.DARK ? this.LIGHT : this.DARK;
    this.setTheme(newTheme);
  },

  /**
   * Render the theme toggle button in the header
   */
  renderToggleButton() {
    const nav = document.querySelector('.header__nav');
    if (!nav) return;

    const button = document.createElement('button');
    button.id = 'themeToggleBtn';
    button.className = 'btn btn--secondary btn--icon';
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.innerHTML = this.getButtonIcon();

    button.addEventListener('click', () => this.toggle());

    nav.insertBefore(button, nav.firstChild);
  },

  /**
   * Get the appropriate icon based on current theme
   */
  getButtonIcon() {
    const isDark = this.getCurrentTheme() === this.DARK;
    return isDark ? '☀️' : '🌙';
  },

  /**
   * Update the button icon after theme change
   */
  updateButtonIcon() {
    const button = document.getElementById('themeToggleBtn');
    if (button) {
      button.innerHTML = this.getButtonIcon();
    }
  }
};

export default Theme;
