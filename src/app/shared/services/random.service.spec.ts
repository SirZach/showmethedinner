
import { RandomDinnerService } from './random.service';
import { Dinner } from '../../models';
import { TestBed, inject } from '@angular/core/testing';

describe('RandomService', () => {
  let $random: RandomDinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RandomDinnerService
      ]
    });

    $random = TestBed.get(RandomDinnerService);
  });

  afterEach(() => {
    $random.dinners = [];
  });

  it('indexInUse', () => {
    const foodDinners = [
      new Dinner({ id: 'a' }),
      new Dinner({ id: 'b' }),
      new Dinner({ id: 'c' })
    ];
    $random.dinners = [
      new Dinner({ id: 'a' })
    ];

    expect($random.indexInUse(0, foodDinners)).toBeTruthy();
    expect($random.indexInUse(1, foodDinners)).toBeFalsy();
    expect($random.indexInUse(2, foodDinners)).toBeFalsy();
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
    expect($random.numberOfMealsLeft(6)).toBe(2);
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
    expect($random.canAddDinner(6)).toBeTruthy();
    $random.dinners = [
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 2 }),
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 1 })
    ];
    expect($random.canAddDinner(6)).toBeFalsy();
  });

  it('calculates if a specific dinner can be added', () => {
    $random.dinners = [
      new Dinner({ meals: 1 }),
      new Dinner({ meals: 2 }),
      new Dinner({ meals: 1 })
    ];
    expect($random.canAdd(new Dinner({ meals: 2 }), 6)).toBeTruthy();
    expect($random.canAdd(new Dinner({ meals: 1 }), 6)).toBeTruthy();
    expect($random.canAdd(new Dinner({ meals: 3 }), 6)).toBeFalsy();
  });

  it('addDinner', () => {
    const a = new Dinner({ id: '1', meals: 2 });
    const b = new Dinner({ id: '2', meals: 1 });
    const c = new Dinner({ id: '3', meals: 1 });
    const d = new Dinner({ id: '4', meals: 2 });
    const e = new Dinner({ id: '5', meals: 3 });
    const f = new Dinner({ id: '6', meals: 2 });
    const g = new Dinner({ id: '7', meals: 2 });

    const foodDinners = [a, b, c, d];

    // Happy path
    $random.addDinner(foodDinners, 6);
    $random.addDinner(foodDinners, 6);
    $random.addDinner(foodDinners, 6);
    $random.addDinner(foodDinners, 6);
    expect($random.dinners.length).toBe(4);
    $random.clearDinners();

    // Error path
    expect(() => $random.addDinner([e], 2)).toThrowError(`Can't add any more dinners...`);
    $random.clearDinners();

    // Make sure it stops adding dinners
    $random.addDinner([a, d, f, g], 6);
    $random.addDinner([a, d, f, g], 6);
    $random.addDinner([a, d, f, g], 6);
    expect(() => $random.addDinner([a, d, f, g], 6)).toThrowError(`Can't add any more dinners...`);
  });

  it('can getRandomIndex', () => {
    const indexTracker = {
      0: true,
      1: true,
      2: true,
      3: true,
      4: false,
      5: false,
      6: true,
      7: true
    };
    expect($random.getRandomIndex(indexTracker)).toBeGreaterThan(3);
    expect($random.getRandomIndex(indexTracker)).toBeLessThan(10);
    indexTracker[4] = true;
    expect($random.getRandomIndex(indexTracker)).toBe(5);
    indexTracker[5] = true;
    expect($random.getRandomIndex(indexTracker)).toBe(-1);
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

  it('when generating random dinners, it cannot get in an infinite loop', () => {
    const foodDinners = [
      new Dinner({ id: '1', meals: 3 }),
      new Dinner({ id: '2', meals: 3 })
    ];

    $random.generateRandomDinners(foodDinners, 6);
    expect(true).toBeTruthy();

    $random.clearDinners();

    expect(() => $random.generateRandomDinners(foodDinners, 5))
      .toThrowError(`Can't add any more dinners...`);
  });

  it('anyIndicesLeft', () => {
    const hasIndicesLeft = {
      0: false,
      1: true,
      2: false,
      3: true
    };
    const noIndicesLeft = {
      0: true,
      1: true,
      2: true
    };
    expect($random.anyIndicesLeft(hasIndicesLeft)).toBeTruthy();
    expect($random.anyIndicesLeft(noIndicesLeft)).toBeFalsy();
  });

  xit('canReplaceDinner', () => {
    const a = new Dinner({ id: '1', meals: 2 });
    const b = new Dinner({ id: '2', meals: 1 });
    const c = new Dinner({ id: '3', meals: 1 });
    const d = new Dinner({ id: '4', meals: 2 });
    const e = new Dinner({ id: '5', meals: 3 });
    const f = new Dinner({ id: '6', meals: 2 });
    const g = new Dinner({ id: '7', meals: 2 });

    $random.dinners = [a, e, b];
    $random.replaceDinner(c, [a, b, c, d, e, f, g], 6);

    expect($random.numberOfMealsLeft(6)).toBe(0);
  });
});
