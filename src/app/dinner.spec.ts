import {
  inject,
  async,
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';
import { Dinner, DinnerDatabase } from './dinner';

const dinners = [
  { name: 'dinner0' },
  { name: 'dinner1' },
  { name: 'dinner2' },
  { name: 'dinner3' },
  { name: 'dinner4' },
  { name: 'dinner5' },
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

  it('should getRandomIndices', () => {
    const indices = dinnerDatabase.getRandomIndices(6);

    expect(indices).toContain(0);
    expect(indices).toContain(1);
    expect(indices).toContain(2);
    expect(indices).toContain(3);
    expect(indices).toContain(4);
    expect(indices).toContain(5);
  });

  it('should get randomDinners', () => {
    const randomDinners = dinnerDatabase.randomDinners(dinners);
    spyOn(dinnerDatabase, 'getRandomIndices').and.returnValue([0,1,2,3,4,5]);

    expect(randomDinners).toContain(dinners[0]);
    expect(randomDinners).toContain(dinners[1]);
    expect(randomDinners).toContain(dinners[2]);
    expect(randomDinners).toContain(dinners[3]);
    expect(randomDinners).toContain(dinners[4]);
    expect(randomDinners).toContain(dinners[5]);
  });

  it('should addDinners when dinners have been found', (done) => {
    spyOn(dinnerDatabase, 'getRandomIndices').and.returnValue([0,1,2,3,4,5]);
    dinnerDatabase.addDinners($googleDrive)
      .then(() => {
        expect(dinnerDatabase.dataChange.getValue().length).toBe(6);
        done();
      });
  });

  it('should addDinners when dinners have not been found yet', (done) => {
    $googleDrive.sheet.rows = [];
    spyOn(dinnerDatabase, 'randomDinners').and.returnValue(dinners);

    
    dinnerDatabase.addDinners($googleDrive)
      .then(() => {
        dinnerDatabase.dataChange.subscribe((d) => {
          expect(d.length).toBe(6);
          done();
        });
      });
  });

  it('should replaceDinner', (done) => {
    const extraDinners = dinners.concat([{ name: 'dinner6' }]);
    $googleDrive.sheet.rows = extraDinners;
    dinnerDatabase.data = dinners;
    spyOn(dinnerDatabase, 'getRandomIndex').and.returnValue(6);

    dinnerDatabase.replaceDinner(dinners[1], $googleDrive);
    dinnerDatabase.dataChange.subscribe((d) => {
      debugger;
      expect(d[1].name).toBe('dinner6');
      done();
    });
  });
});
