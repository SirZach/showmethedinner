import { DinnersComponent } from './dinners.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: DinnersComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
