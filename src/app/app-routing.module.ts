import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
    path: 'random',
    canActivate: [AuthGuard],
    loadChildren: './modules/random/index#RandomModule'
  }, {
    path: 'dinners',
    canActivate: [AuthGuard],
    loadChildren: './modules/dinners/index#DinnersModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
