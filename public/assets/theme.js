// Theme management
class ThemeManager {
  constructor() {
    this.THEME_KEY = 'math-tools-theme';
    this.LIGHT = 'light';
    this.DARK = 'dark';
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.THEME_KEY);
    const preferred = this.getSystemPreference();
    const theme = saved || preferred;
    this.setTheme(theme);
  }

  getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? this.DARK : this.LIGHT;
  }

  setTheme(theme) {
    const isValid = theme === this.LIGHT || theme === this.DARK;
    const themeToSet = isValid ? theme : this.LIGHT;
    
    localStorage.setItem(this.THEME_KEY, themeToSet);
    
    if (themeToSet === this.DARK) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  toggle() {
    const current = localStorage.getItem(this.THEME_KEY) || this.LIGHT;
    const newTheme = current === this.LIGHT ? this.DARK : this.LIGHT;
    this.setTheme(newTheme);
    return newTheme;
  }

  getCurrentTheme() {
    return localStorage.getItem(this.THEME_KEY) || this.LIGHT;
  }
}

// Initialize theme manager globally
const themeManager = new ThemeManager();

// Setup theme toggle button
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    const currentTheme = themeManager.getCurrentTheme();
    toggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    
    toggle.addEventListener('click', () => {
      const newTheme = themeManager.toggle();
      toggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
  }
});
