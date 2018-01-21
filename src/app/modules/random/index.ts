import { RandomComponent } from './random.component';
import { NgModule } from '@angular/core';
import { routing } from './random.routing';
import { SharedModule } from '../../shared';

@NgModule({
  imports: [
    routing,
    SharedModule
  ],
  declarations: [
    RandomComponent
  ],
  providers: []
})
export class RandomModule {}
