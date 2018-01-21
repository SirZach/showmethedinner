import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }, {
    path: 'login',
    loadChildren: './modules/login/index#LoginModule'
  }, {
    path: 'random/:userId',
    canActivate: [AuthGuard],
    loadChildren: './modules/random/index#RandomModule'
  }, {
    path: 'dinners/:userId',
    canActivate: [AuthGuard],
    loadChildren: './modules/dinners/index#DinnersModule'
  }
];

export const APP_ROUTING: ModuleWithProviders = RouterModule.forRoot(routes);
