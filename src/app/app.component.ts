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
  public displayedColumns: string[] = ['name', 'category', 'time', 'servings', 'meals', 'replace'];
  public dinnerDatabase = new DinnerDatabase();
  public dataSource: DinnerDataSource | null;
  public loadingDinners: boolean = false;
  constructor(
    private $googleDrive: GoogleDriveService,
    private zone: NgZone
  ) {}

  public ngOnInit() {
    this.dataSource = new DinnerDataSource(this.dinnerDatabase);
  }

  public showMeTheDinner(): void {
    this.loadingDinners = true;
    this.dinnerDatabase.addDinners(this.$googleDrive)
      .then(() => this.loadingDinners = false)
      .then(() => this.zone.run(() => {}));
  }

  public replaceDinner(dinner: Dinner) {
    this.dinnerDatabase.replaceDinner(dinner, this.$googleDrive);
    this.zone.run(() => {});
  }
}
