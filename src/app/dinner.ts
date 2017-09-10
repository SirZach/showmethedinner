import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { GoogleDriveService } from './google-drive/google-drive.service';

export interface Dinner {
  name: string;
  recipe: string;
  category: string;
  time: number;
  servings: number;
  meals: number;
}

export class DinnerDatabase {
  public randomIndices: number[] = [];

  /** Stream that emits whenever the data has been modified. */
  public dataChange: BehaviorSubject<Dinner[]> = new BehaviorSubject<Dinner[]>([]);
  get data(): Dinner[] { return this.dataChange.value; }
  set data(dinners) { this.dataChange.next(dinners); }

  public getRandomIndex(max: number): number {
    return Math.floor(Math.random() * max);
  }

  /**
   * Generate an array of 6 random numbers
   * @param max maximum number to generate a random index for
   */
  public getRandomIndices(max: number): number[] {
    const indices = [];

    while (indices.length < 6) {
      const randomnumber = this.getRandomIndex(max);

      if (indices.includes(randomnumber)) continue;
      indices.push(randomnumber);
    }

    return indices;
  }

  /**
   * Generate 6 random dinners
   * @param dinners list of all dinnners available
   */
  randomDinners(dinners: Dinner[]) {
    this.randomIndices = this.getRandomIndices(dinners.length);

    return dinners.filter((dinner, index) => this.randomIndices.includes(index));
  }

  /**
   * Main driver for populating the table with random dinners
   * @param $googleDrive google drive service to retrieve spreadsheet
   */
  addDinners($googleDrive: GoogleDriveService) {
    const rows = $googleDrive.sheet.rows;
    const promise = rows.length ? Promise.resolve() : $googleDrive.getSheet();

    return promise.then(() => {
      const sheetDinners = $googleDrive.sheet.rows.slice();
      const randomDinners = this.randomDinners(sheetDinners);

      this.dataChange.next(randomDinners);
    });
  }

  replaceDinner(dinner: Dinner, $googleDrive: GoogleDriveService) {
    const sheetRows = $googleDrive.sheet.rows;
    const data = this.data.slice();
    const dinnerIndex = data.findIndex(d => d.name === dinner.name);
    const randomDinnerIndices = data.map((d: Dinner) => {
      return sheetRows.findIndex(sD => sD.name === d.name);
    });

    let newDinnerIndex;
    do {
      newDinnerIndex = this.getRandomIndex(sheetRows.length);
    } while (randomDinnerIndices.includes(newDinnerIndex));

    data.splice(dinnerIndex, 0, sheetRows[newDinnerIndex]);
    data.splice(dinnerIndex + 1, 1);
    this.dataChange.next(data);
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, DinnerDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class DinnerDataSource extends DataSource<any> {
  constructor(private dinnerDatabase: DinnerDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Dinner[]> {
    return this.dinnerDatabase.dataChange.asObservable();
  }

  disconnect() {}
}
