import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
  Dinner
} from '../../models';
import {
  AuthService,
  FoodService,
  RandomDinnerService,
  UserService
} from '../../shared/services';
import 'rxjs/add/operator/switchMap';

// import { Dinner, DinnerDatabase, DinnerDataSource } from './dinner';

@Component({
  selector: 'random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.scss']
})
export class RandomComponent implements OnInit {
  loadingDinners: boolean = false;

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    public $auth: AuthService,
    public $food: FoodService,
    public $randomDinner: RandomDinnerService,
    public $user: UserService
  ) {}

  public ngOnInit() {
    this.route.params
      .switchMap((params: Params) => {
        this.loadingDinners = true;
        return this.$food.getDinners(this.$auth.user.uid);
      })
      .subscribe((dinners: Dinner[]) => {
        this.loadingDinners = false;
        this.$randomDinner.generateRandomDinners();
      });
  }
}
