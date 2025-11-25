import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ThemeToggleComponent,
    AppHeaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingSpinnerComponent,
    ThemeToggleComponent,
    AppHeaderComponent
  ]
})
export class SharedModule { }
