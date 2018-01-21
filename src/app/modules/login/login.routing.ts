import { LoginComponent } from './login.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: LoginComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);