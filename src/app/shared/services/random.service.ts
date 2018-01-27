import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  Dinner,
  User
} from '../../models';
import {
  AuthService,
  FoodService
} from '../../shared/services';

@Injectable()
export class RandomDinnerService {
  dinners: Dinner[] = [];

  constructor(
    private zone: NgZone,
    private $auth: AuthService,
    private $food: FoodService
  ) {}

  /**
   * Remove the dinner from the database
   * @param dinner Dinner
   */
  remove(dinner: Dinner): void {
    const index = this.dinners.findIndex(d => d.id === dinner.id);

    this.dinners.splice(index, 1);
  }

  /** Find a dinner to add */
  addDinner(): void {
    let randomIndex = this.getRandomIndex(this.$food.dinners.length);

    while (this.indexInUse(randomIndex) || !this.canAdd(this.$food.dinners[randomIndex])) {
      randomIndex = this.getRandomIndex(this.$food.dinners.length);
    }
    this.dinners.push(this.$food.dinners[randomIndex]);
  }

  /**
   * Is the dinner within the meals requirement
   * @param dinner Dinner
   */
  canAdd(dinner: Dinner): boolean {
    return this.numberOfMealsLeft() - dinner.meals >= 0;
  }

  /**
   * Create a random number
   * @param max max number to create a random number up to
   */
  getRandomIndex(max: number): number {
    return Math.floor(Math.random() * max);
  }

  /**
   * Does the index have a sheet dinner already in the database
   * @param index number
   */
  indexInUse(index: number): boolean {
    const foodServiceDinner = this.$food.dinners[index];
    
    return this.dinners.filter(d => d.id === foodServiceDinner.id).length > 0;
  }

  /**
   * Replace the dinner with 1 or more depending on meals requirements
   * @param dinner Dinner
   */
  replaceDinner(dinner: Dinner) {
    this.remove(dinner);
    this.generateRandomDinners();
  }

  /**
   * Fill up remaining dinner slots
   */
  generateRandomDinners(): void {
    this.clearDinners();

    if (this.canAddDinner()) {
      do {
        this.addDinner();
      } while (this.canAddDinner());
    }
  }

  /**
   * Has the meal requirement been met
   */
  canAddDinner(): boolean {
    return this.numberOfMealsLeft() > 0;
  }

  /**
   * How many meals left
   */
  numberOfMealsLeft(): number {
    return this.$auth.user.mealsCount - this.numberOfMeals(this.dinners);
  }

  numberOfMeals(dinners: Dinner[]): number {
    return dinners.reduce((prev, dinner) => {
      return prev + dinner.meals;
    }, 0);
  }

  /**
   * Clear out random dinners, usually to start anew
   */
  clearDinners(): void {
    this.dinners = [];
  }

  /**
   * Calculates if there is a possible combination of
   * dinners whose meals add up to the sum
   * Credit to: https://www.geeksforgeeks.org/subset-sum-problem-osum-space/
   */
  isSubsetSum(arr: number[], sum: number): boolean {
    const subset = [
      Array(sum + 1).fill(0).map(x => false),
      Array(sum + 1).fill(0).map(x => false)
    ];

    const a = this.initializeArray(arr.length + 1);
    const b = this.initializeArray(sum + 1);

    a.forEach((i) => {
      b.forEach((j) => {
        if (j === 0) {
          subset[i % 2][j] = true;
        } else if (i === 0) {
          subset[i % 2][j] = false;
        } else if (arr[i - 1] <= j) {
          subset[i % 2][j] = subset[(i + 1) % 2][j - arr[i - 1]] || subset[(i + 1) % 2][j]; 
        } else {
          subset[i % 2][j] = subset[(i + 1) % 2][j];
        }
      });
    });

    return subset[arr.length % 2][sum];
  }

  private initializeArray(length: number): number[] {
    return Array(length).fill(0).map((x, i) => i);
  }
}
