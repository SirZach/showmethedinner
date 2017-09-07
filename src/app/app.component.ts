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
  constructor(
    private $googleDrive: GoogleDriveService,
    private zone: NgZone
  ) {}

  displayedColumns: string[] = ['name', 'category', 'time', 'servings', 'meals'];
  dinnerDatabase = new DinnerDatabase();
  dataSource: DinnerDataSource | null;
  loadingDinners: boolean = false;

  ngOnInit() {
    this.dataSource = new DinnerDataSource(this.dinnerDatabase);
  }

  showMeTheDinner() {
    this.loadingDinners = true;
    this.dinnerDatabase.addDinners(this.$googleDrive)
      .then(() => this.loadingDinners = false)
      .then(() => this.zone.run(() => {}));
  }
}