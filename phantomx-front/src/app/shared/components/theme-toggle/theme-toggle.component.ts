import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService, Theme } from '../../../core/services/theme.service';

export type ThemeToggleSize = 'small' | 'medium' | 'large';
export type ThemeToggleStyle = 'switch' | 'button' | 'icon';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  @Input() size: ThemeToggleSize = 'medium';
  @Input() style: ThemeToggleStyle = 'switch';
  @Input() showLabel: boolean = true;

  isDarkTheme = false;
  currentTheme: Theme = 'light';
  private destroy$ = new Subject<void>();
  
  _uniqueId = Math.random().toString(36).substr(2, 9);

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.currentTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
        this.isDarkTheme = theme === 'dark';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  get iconClass(): string {
    return this.isDarkTheme ? 'fa-moon' : 'fa-sun';
  }

  get label(): string {
    return this.isDarkTheme ? 'Oscuro' : 'Claro';
  }

  get containerClasses(): string {
    return `theme-toggle theme-toggle--${this.size} theme-toggle--${this.style}`;
  }
}
