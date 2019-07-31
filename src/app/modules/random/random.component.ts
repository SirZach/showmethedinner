import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {
  Dinner
} from '../../models';
import {
  AuthService,
  FoodService,
  RandomDinnerService,
  UserService
} from '../../shared/services';

@Component({
  selector: 'random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.scss']
})
export class RandomComponent implements OnInit {
  loadingDinners: boolean = false;
  enoughMeals: boolean = true;
  canSequence: boolean = true;

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
    this.route.params.pipe(
      switchMap((params: Params) => {
        this.loadingDinners = true;
        return this.$food.getDinners(this.$auth.user.uid);
      })
    ).subscribe((dinners: Dinner[]) => {
      this.generateRandomDinners();
      this.loadingDinners = false;
    });
  }

  generateRandomDinners() {
    const mealsCount = this.$auth.user.mealsCount;
    const mealsArray = this.$food.dinners.map(d => d.meals);

    this.$randomDinner.clearDinners();

    if (this.$food.numberOfMeals() >= mealsCount) {
      if (this.$randomDinner.isSubsetSum(mealsArray, mealsCount)) {
        this.$randomDinner.generateRandomDinners(this.$food.dinners, mealsCount);
      } else {
        this.canSequence = false;
      }
      this.enoughMeals = true;
    } else {
      this.enoughMeals = false;
      this.canSequence = true;
    }
  }

  mealsCountSelectionChanged() {
    this.enoughMeals = true;
    this.canSequence = true;
    this.$user.saveUser(this.$auth.user);
  }
}
