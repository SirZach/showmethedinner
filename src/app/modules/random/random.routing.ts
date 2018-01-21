import { RandomComponent } from './random.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: RandomComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
