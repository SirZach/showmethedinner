/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  NgZone,
  ViewEncapsulation
} from '@angular/core';

import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { GoogleDriveService, Dinner } from './google-drive/google-drive.service';

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Dinner[]> = new BehaviorSubject<Dinner[]>([]);
  get data(): Dinner[] { return this.dataChange.value; }
  set data(dinners) { this.dataChange.next(dinners); }

  getRandomIndices(max: number): number[] {
    let indices = [];

    while (indices.length < 6) {
      const randomnumber = Math.ceil(Math.random()*max)
      
      if (indices.includes(randomnumber)) continue;
      indices[indices.length] = randomnumber;
    }

    return indices;
  }

  randomDinners(dinners: Dinner[]) {
    const randomIndices = this.getRandomIndices(dinners.length - 1);

    return dinners.filter((dinner, index) => randomIndices.includes(index));
  }

  addData(dinners: Dinner[]) {
    this.data = [];
    dinners.forEach((dinner) => {
      const copiedData = this.data.slice();
      copiedData.push(dinner);
      this.dataChange.next(copiedData);
    });
  }

  addDinners($googleDrive: GoogleDriveService) {
    const rows = $googleDrive.sheet.rows;
    const promise = rows.length ? Promise.resolve() : $googleDrive.getSheet();

    return promise.then(() => {
      const sheetDinners = $googleDrive.sheet.rows.slice();
      const randomDinners = this.randomDinners(sheetDinners);

      this.addData(randomDinners);
    })
  }
}

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss'
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private $googleDrive: GoogleDriveService,
    private zone: NgZone
  ) {}

  displayedColumns: string[] = ['name', 'category', 'time', 'servings', 'meals'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;
  loadingDinners: boolean = false;

  ngOnInit() {
    this.dataSource = new ExampleDataSource(this.exampleDatabase);
  }

  handleClick() {
    this.loadingDinners = true;
    this.exampleDatabase.addDinners(this.$googleDrive)
      .then(() => this.loadingDinners = false)
      .then(() => this.zone.run(() => {}));
  }

}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  constructor(private _exampleDatabase: ExampleDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Dinner[]> {
    return this._exampleDatabase.dataChange;
  }

  disconnect() {}
}