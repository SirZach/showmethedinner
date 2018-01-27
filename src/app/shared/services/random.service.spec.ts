
import { RandomDinnerService } from './random.service';
import { AuthService } from './auth.service';
import { FoodService } from './food.service';
import { Dinner } from '../../models';
import { TestBed, inject } from '@angular/core/testing';

describe('RandomService', () => {
  let $random: RandomDinnerService;
  let $food: FoodService;
  const authStub = {
    user: {
      mealsCount: 6
    }
  };
  const foodStub = {

  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RandomDinnerService,
        { provide: AuthService, useValue: authStub },
        { provide: FoodService, useValue: foodStub }
      ]
    });

    $random = TestBed.get(RandomDinnerService);
    $food = TestBed.get(FoodService);
  });

  afterEach(() => {
    $random.dinners = [];
    $food.dinners = [];
  });

  it('indexInUse', () => {
    $food.dinners = [
      new Dinner({ id: 'a' }),
      new Dinner({ id: 'b' }),
      new Dinner({ id: 'c' })
    ];
    $random.dinners = [
      new Dinner({ id: 'a' })
    ];

    expect($random.indexInUse(0)).toBeTruthy();
    expect($random.indexInUse(1)).toBeFalsy();
    expect($random.indexInUse(2)).toBeFalsy();
  });

  it('can calculate numberOfMeals', () => {
    const dinners = [
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 2 }),
      new Dinner({ meals: 1 })
    ];
    expect($random.numberOfMeals(dinners)).toBe(4);
  });

  it('can calculate numberOfMealsLeft', () => {
    $random.dinners = [
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 2 }),
      new Dinner({ meals: 1 })
    ];
    expect($random.numberOfMealsLeft()).toBe(2);
  });

  it('can clearDinners', () => {
    $random.dinners = [
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 2 }),
      new Dinner({ meals: 1 })
    ];
    $random.clearDinners();
    expect($random.dinners.length).toBe(0);
  });

  it('calculates if canAddDinner correctly', () => {
    $random.dinners = [
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 2 }),
      new Dinner({ meals: 1 })
    ];
    expect($random.canAddDinner()).toBeTruthy();
    $random.dinners = [
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 2 }),
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 1 })
    ];
    expect($random.canAddDinner()).toBeFalsy();
  });

  it('calculates if a specific dinner can be added', () => {
    $random.dinners = [
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 2 }),
      new Dinner({ meals: 1 })
    ];
    expect($random.canAdd(new Dinner({ meals: 2 }))).toBeTruthy();
    expect($random.canAdd(new Dinner({ meals: 1 }))).toBeTruthy();
    expect($random.canAdd(new Dinner({ meals: 3 }))).toBeFalsy();
  });

  it('can getRandomIndex', () => {
    expect($random.getRandomIndex(10)).toBeGreaterThan(-1);
    expect($random.getRandomIndex(10)).toBeLessThan(10);
    expect($random.getRandomIndex(1)).toBe(0);
  });

  it('should remove a dinner', () => {
    const theDinner = new Dinner({ id: '1', meals: 2 });
    $random.dinners = [
      new Dinner({ id: 'a' }),
      theDinner,
      new Dinner({ id: 'b' })
    ];
    $random.remove(theDinner);

    expect($random.dinners.length).toBe(2);
    expect($random.dinners[0].id).toBe('a');
    expect($random.dinners[1].id).toBe('b');
  });

  it('isSubsetSum', () => {
    expect($random.isSubsetSum([3, 3, 4], 6)).toBeTruthy();
    expect($random.isSubsetSum([3, 2, 4], 6)).toBeTruthy();
    expect($random.isSubsetSum([2, 3, 3], 4)).toBeFalsy();
    expect($random.isSubsetSum([1, 1, 1, 1], 6)).toBeFalsy();
  });
});
