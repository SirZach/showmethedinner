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
  time: string;
  servings: string;
  meals: number;
}

export class DinnerDatabase {
  public randomIndices: number[] = [];

  /** Stream that emits whenever the data has been modified. */
  public dataChange: BehaviorSubject<Dinner[]> = new BehaviorSubject([]);
  get data(): Dinner[] { return this.dataChange.value; }
  set data(dinners) { this.dataChange.next(dinners); }

  $googleDrive: GoogleDriveService;

  /** How many meals for the week */
  mealsCount: number = 6;

  /** Find a dinner to add */
  add(): void {
    const dinners = this.data.slice(0);
    const sheetDinners = this.$googleDrive.sheet.rows.slice();
    let randomIndex = this.getRandomIndex(sheetDinners.length);

    while (this.indexInUse(randomIndex) || !this.canAdd(sheetDinners[randomIndex])) {
      randomIndex = this.getRandomIndex(sheetDinners.length);
    }
    dinners.push(sheetDinners[randomIndex]);

    this.dataChange.next(dinners);
  }

  /**
   * Is the dinner within the meals requirement
   * @param dinner Dinner
   */
  canAdd(dinner: Dinner): boolean {
    return this.numberOfMealsLeft() - dinner.meals >= 0;
  }

  /**
   * Does the index have a sheet dinner already in the database
   * @param index number
   */
  indexInUse(index: number): boolean {
    const sheetDinner = this.$googleDrive.sheet.rows[index];
    
    return this.data.filter(d => d.name === sheetDinner.name).length > 0;
  }

  /**
   * Fill up remaining dinner slots
   */
  addToCompletion(): void {
    if (this.canAddDinner()) {
      do {
        this.add();
      } while (this.canAddDinner());
    }
  }

  /**
   * Remove the dinner from the database
   * @param dinner Dinner
   */
  remove(dinner: Dinner): void {
    const data = this.data.slice();
    const index = data.findIndex(d => d.name === dinner.name);

    data.splice(index, 1);
    this.dataChange.next(data);
  }

  /**
   * Replace the dinner with 1 or more depending on meals requirements
   * @param dinner Dinner
   */
  replaceDinner(dinner: Dinner) {
    this.remove(dinner);
    this.addToCompletion();
  }

  /**
   * How many meals left
   */
  numberOfMealsLeft(): number {
    return this.mealsCount - this.data.reduce((prev, dinner) => {
      prev += dinner.meals;
      return prev;
    }, 0);
  }

  /**
   * Has the meal requirement been met
   */
  canAddDinner(): boolean {
    return this.numberOfMealsLeft() > 0;
  }

  /**
   * Create a random number
   * @param max max number to create a random number up to
   */
  getRandomIndex(max: number): number {
    return Math.floor(Math.random() * max);
  }

  /**
   * Main driver for populating the table with random dinners
   */
  initDinners() {
    const rows = this.$googleDrive.sheet.rows;
    const promise = rows.length ? Promise.resolve() : this.$googleDrive.getSheet();

    return promise.then(() => this.addToCompletion());
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
  constructor(
    private dinnerDatabase: DinnerDatabase,
    private $googleDrive: GoogleDriveService
  ) {
    super();
    this.dinnerDatabase.$googleDrive = $googleDrive;
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Dinner[]> {
    return this.dinnerDatabase.dataChange.asObservable();
  }

  disconnect() {}
}
