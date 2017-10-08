import {
  inject,
  async,
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';
import { Dinner, DinnerDatabase } from './dinner';

const dinners = [
  { name: 'dinner0', meals: 1 },
  { name: 'dinner1', meals: 2 },
  { name: 'dinner3', meals: 4 },
];
const $googleDrive = {
  sheet: {
    rows: dinners
  },
  getSheet() {
    return Promise.resolve(dinners);
  }
};

describe('DinnerDatabase', () => {
  let dinnerDatabase;

  beforeEach(() => {
    dinnerDatabase = new DinnerDatabase();
  });

  it('should get randomIndex', () => {
    expect(dinnerDatabase.getRandomIndex(1)).toBe(0);
  });

  xit('should replaceDinner', (done) => {
    const extraDinners = dinners.concat([{ name: 'dinner6', meals: 1 }]);
    $googleDrive.sheet.rows = extraDinners;
    dinnerDatabase.$googleDrive = $googleDrive;
    dinnerDatabase.data = dinners;
    spyOn(dinnerDatabase, 'getRandomIndex').and.returnValue(6);

    dinnerDatabase.replaceDinner(dinners[1]);
    dinnerDatabase.dataChange.subscribe((d) => {
      expect(d[1].name).toBe('dinner6');
      done();
    });
  });
});
