import { LoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { routing } from './login.routing';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    routing,
    SharedModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
  ]
})
export class LoginModule {}
