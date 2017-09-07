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
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Dinner[]> = new BehaviorSubject<Dinner[]>([]);
  get data(): Dinner[] { return this.dataChange.value; }
  set data(dinners) { this.dataChange.next(dinners); }

  /**
   * Generate an array of 6 random numbers
   * @param max maximum number to generate a random index for
   */
  getRandomIndices(max: number): number[] {
    let indices = [];

    while (indices.length < 6) {
      const randomnumber = Math.ceil(Math.random()*max)
      
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
    const randomIndices = this.getRandomIndices(dinners.length - 1);

    return dinners.filter((dinner, index) => randomIndices.includes(index));
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
    })
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
  constructor(private _dinnerDatabase: DinnerDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Dinner[]> {
    return this._dinnerDatabase.dataChange.asObservable();
  }

  disconnect() {}
}