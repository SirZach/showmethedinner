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
      prev += dinner.meals;
      return prev;
    }, 0);
  }

  /**
   * Clear out random dinners, usually to start anew
   */
  clearDinners(): void {
    this.dinners = [];
  }
}