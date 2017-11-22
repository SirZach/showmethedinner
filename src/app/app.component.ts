import {
  Component,
  OnInit,
  NgZone,
  ViewEncapsulation
} from '@angular/core';
import { GoogleDriveService } from './google-drive/google-drive.service';
import { Dinner, DinnerDatabase, DinnerDataSource } from './dinner';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'time', 'servings', 'meals', 'replace'];
  dinnerDatabase = new DinnerDatabase();
  dataSource: DinnerDataSource | null;
  loadingDinners: boolean = false;

  constructor(
    private $googleDrive: GoogleDriveService,
    private zone: NgZone
  ) {}

  public ngOnInit() {
    this.dataSource = new DinnerDataSource(this.dinnerDatabase, this.$googleDrive);
    this.dinnerDatabase.loadDinnersFromLocalStorage();
  }

  public showMeTheDinner(): void {
    this.loadingDinners = true;
    this.dinnerDatabase.initDinners()
      .then(() => this.loadingDinners = false)
      .then(() => this.zone.run(() => {}));
  }

  public replaceDinner(dinner: Dinner) {
    this.dinnerDatabase.replaceDinner(dinner);
    this.zone.run(() => {});
  }
}
