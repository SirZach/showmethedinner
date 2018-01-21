
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatIconModule,
  MatDialogModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatSelectModule,
  MatSidenavModule,
  MatProgressSpinnerModule
} from '@angular/material';

const modules = [
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatIconModule,
  MatDialogModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatTooltipModule,
  MatSelectModule,
  MatSidenavModule,
  MatProgressSpinnerModule
];

@NgModule({
  imports: modules,
  exports: modules
})
export class CustomMaterialModule { }