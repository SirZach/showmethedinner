import { FoodService } from './food.service';
import { Dinner } from '../../models';
import { TestBed, inject } from '@angular/core/testing';

describe('FoodService', () => {
  let $food: FoodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FoodService
      ]
    });

    $food = TestBed.get(FoodService);
  });

  afterEach(() => {
    $food.setDinners([]);
  });

  it('should setDinners', () => {
    const dinners = [
      new Dinner({ id: '1' }),
      new Dinner({ id: '2' })
    ];

    $food.setDinners(dinners);
    expect($food.dinners.length).toBe(2);
    expect($food.dinners[0].id).toBe('1');
    expect($food.dinners[1].id).toBe('2');
  });

  it('should pushDinner', () => {
    $food.pushDinner(new Dinner({ id: 'new' }));

    expect($food.dinners.length).toBe(1);
    expect($food.dinners[0].id).toBe('new');
  });

  it('should sortDinners', () => {
    const dinners = [
      new Dinner({ name: 'z' }),
      new Dinner({ name: 'z' }),
      new Dinner({ name: 'qual' }),
      new Dinner({ name: 's' }),
      new Dinner({ name: 'Ack' })
    ];

    $food.setDinners(dinners);
    $food.sortDinners();

    expect($food.dinners[0].name).toBe('Ack');
    expect($food.dinners[1].name).toBe('qual');
    expect($food.dinners[2].name).toBe('s');
    expect($food.dinners[3].name).toBe('z');
    expect($food.dinners[4].name).toBe('z');
  });

  it('numberOfMeals', () => {
    $food.setDinners([
      new Dinner({ meals: 2 }),
      new Dinner({ meals: 3 }),
      new Dinner({ meals: 1 })
    ]);

    expect($food.numberOfMeals()).toBe(6);
  });
});
