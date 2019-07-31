import { Injectable, NgZone } from '@angular/core';
import {
  Dinner,
  User
} from '../../models';

interface IndexTracker {
  [propName: number]: boolean;
}

@Injectable()
export class RandomDinnerService {
  dinners: Dinner[] = [];

  constructor(private zone: NgZone) {}

  /**
   * Remove the dinner from the database
   * @param dinner Dinner
   */
  remove(dinner: Dinner): void {
    const index = this.dinners.findIndex(d => d.id === dinner.id);

    this.dinners.splice(index, 1);
  }

  /** Find a dinner to add */
  addDinner(foodDinners: Dinner[], mealsCount: number): void {
    const indexTracker: IndexTracker = foodDinners.reduce((prev, dinner, index) => {
      if (this.indexInUse(index, foodDinners)) {
        prev[index] = true;
      } else {
        prev[index] = false;
      }

      return prev;
    }, {});
    let randomIndex = this.getRandomIndex(indexTracker);

    while (
      randomIndex > -1 &&
      (this.indexInUse(randomIndex, foodDinners) || 
      !this.canAdd(foodDinners[randomIndex], mealsCount)) &&
      this.anyIndicesLeft(indexTracker)
    ) {
      indexTracker[randomIndex] = true;
      randomIndex = this.getRandomIndex(indexTracker);
    }

    if (randomIndex < 0) {
      throw new Error(`Can't add any more dinners...`);
    }

    this.dinners.push(foodDinners[randomIndex]);
  }

  /**
   * 
   * @param indexTracker 
   */
  anyIndicesLeft(indexTracker: IndexTracker): boolean {
    const unusedIndices = Object.keys(indexTracker).filter(i => indexTracker[i] === false);

    return !!unusedIndices.length;
  }

  /**
   * Is the dinner within the meals requirement
   * @param dinner Dinner
   */
  canAdd(dinner: Dinner, mealsCount: number): boolean {
    return this.numberOfMealsLeft(mealsCount) - dinner.meals >= 0;
  }

  /**
   * Create a random number
   * @param max max number to create a random number up to
   */
  getRandomIndex(indexTracker: IndexTracker): number {
    const c = [];
    const max = Object.keys(indexTracker).length;

    for (let i = 0; i < max; i++) {
      if (!indexTracker[i]) {
        c.push(i);
      }
    }

    if (c.length === 0) {
      return -1;
    }

    return c[Math.floor(Math.random() * c.length)];
  }

  /**
   * Does the index have a dinner already in the database
   * @param index number
   */
  indexInUse(index: number, foodDinners: Dinner[]): boolean {
    const foodServiceDinner = foodDinners[index];
    
    return this.dinners.filter(d => d.id === foodServiceDinner.id).length > 0;
  }

  /**
   * Replace the dinner with 1 or more depending on meals requirements
   * @param dinner Dinner
   */
  replaceDinner(dinner: Dinner, foodDinners: Dinner[], mealsCount: number) {
    this.remove(dinner);
    this.generateRandomDinners(foodDinners, mealsCount);
  }

  /**
   * Fill up remaining dinner slots
   */
  generateRandomDinners(foodDinners: Dinner[], mealsCount: number): void {
    let counter = 0;

    if (this.canAddDinner(mealsCount)) {
      do {
        counter++;
        this.addDinner(foodDinners, mealsCount);
      } while (this.canAddDinner(mealsCount) && counter < 50);
    }
  }

  /**
   * Has the meal requirement been met
   */
  canAddDinner(mealsCount: number): boolean {
    return this.numberOfMealsLeft(mealsCount) > 0;
  }

  /**
   * How many meals left
   */
  numberOfMealsLeft(mealsCount: number): number {
    return mealsCount - this.numberOfMeals(this.dinners);
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
