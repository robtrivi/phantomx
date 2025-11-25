import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'phantomx-front';
  mostrarHeader = false;
  nombreUsuario = '';

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.nombreUsuario = this.authService.getUsuario() || 'Usuario';

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.mostrarHeader = !event.url.includes('/login');
        this.nombreUsuario = this.authService.getUsuario() || 'Usuario';
      });

    this.mostrarHeader = !this.router.url.includes('/login');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
