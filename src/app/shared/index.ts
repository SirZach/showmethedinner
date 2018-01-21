import { CustomMaterialModule } from './../material';
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

// Pipes
import {

} from './pipes';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    CustomMaterialModule,
    FlexLayoutModule
  ],
  declarations: [

    // SHARED COMPONENTS
    DinnerComponent,
    CenteredLoadingComponent

    // Pipes
  ],
  exports: [
    // angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    FlexLayoutModule,

    // SHARED COMPONENTS
    DinnerComponent,
    CenteredLoadingComponent
  
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