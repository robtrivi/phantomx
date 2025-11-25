import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'phantomx_theme';
  private readonly currentThemeSubject: BehaviorSubject<Theme>;
  public readonly currentTheme$: Observable<Theme>;

  constructor() {
    const initialTheme = this.getInitialTheme();
    this.currentThemeSubject = new BehaviorSubject<Theme>(initialTheme);
    this.currentTheme$ = this.currentThemeSubject.asObservable();
    this.applyTheme(initialTheme);
    this.listenToSystemThemeChanges();
  }

  toggleTheme(): void {
    const newTheme: Theme =
      this.currentThemeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    if (theme !== this.currentThemeSubject.value) {
      this.currentThemeSubject.next(theme);
      this.applyTheme(theme);
      this.saveTheme(theme);
    }
  }

  getCurrentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  isDarkTheme(): boolean {
    return this.currentThemeSubject.value === 'dark';
  }

  private getInitialTheme(): Theme {
    const savedTheme = this.getSavedTheme();
    if (savedTheme) {
      return savedTheme;
    }

    return this.getSystemThemePreference();
  }

  private getSavedTheme(): Theme | null {
    const saved = localStorage.getItem(this.THEME_KEY);
    return saved === 'dark' || saved === 'light' ? saved : null;
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private getSystemThemePreference(): Theme {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light';
  }

  private listenToSystemThemeChanges(): void {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', (e) => {
          if (!this.getSavedTheme()) {
            const newTheme: Theme = e.matches ? 'dark' : 'light';
            this.currentThemeSubject.next(newTheme);
            this.applyTheme(newTheme);
          }
        });
      }
    }
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(`theme-${theme}`);

    body.setAttribute('data-theme', theme);
  }
}
