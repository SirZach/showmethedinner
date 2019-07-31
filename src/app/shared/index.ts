import { MaterialModule } from './../material';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Services
import {
  AuthService,
  FoodService,
  UserService,
  RandomDinnerService,
  AuthGuard
} from './services';

// Components
import {
  DinnerComponent,
  CenteredLoadingComponent
} from './components';

// Directives
import {
  AutofocusDirective
} from './directives';

// Pipes
// import {

// } from './pipes';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule
  ],
  declarations: [

    // SHARED COMPONENTS
    DinnerComponent,
    CenteredLoadingComponent,

    // Directives
    AutofocusDirective

    // Pipes
  ],
  exports: [
    // angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,

    // SHARED COMPONENTS
    DinnerComponent,
    CenteredLoadingComponent,

    // Directives
    AutofocusDirective
  
    // pipes
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AuthService,
        FoodService,
        UserService,
        RandomDinnerService,
        AuthGuard
      ]
    };
  }
}
