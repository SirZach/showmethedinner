import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {
  Dinner
} from '../../models';
import {
  AuthService,
  FoodService
} from '../../shared/services';

// import { Dinner, DinnerDatabase, DinnerDataSource } from './dinner';

@Component({
  selector: 'dinners',
  templateUrl: './dinners.component.html',
  styleUrls: ['./dinners.component.scss']
})
export class DinnersComponent implements OnInit {
  loadingDinners: boolean = false;

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    public $auth: AuthService,
    public $food: FoodService
  ) {}

  public ngOnInit() {
    this.route.params.pipe(
        switchMap((params: Params) => {
          this.loadingDinners = true;
          return this.$food.getDinners(this.$auth.user.uid);
        })
      ).subscribe((dinners: Dinner[]) => {
        this.loadingDinners = false;
      });
  }

  addDinner() {
    this.$food.createDinner(new Dinner({
      uid: this.$auth.user.uid
    }));
  }

  revertDinner(dinner: Dinner) {
    if (!dinner.id) {
      const index = this.$food.dinners.findIndex(d => d === dinner);

      this.$food.dinners.splice(index, 1);
    }
  }
}
