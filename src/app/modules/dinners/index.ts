import { DinnersComponent } from './dinners.component';
import { NgModule } from '@angular/core';
import { routing } from './dinners.routing';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    routing,
    SharedModule
  ],
  declarations: [
    DinnersComponent
  ],
  providers: [
  ]
})
export class DinnersModule {}
