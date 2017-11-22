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
  loggedIn: boolean = false;

  constructor(
    private $googleDrive: GoogleDriveService,
    private zone: NgZone
  ) {}

  public ngOnInit() {
    gapi.load('client:auth2', this.initGAPI.bind(this));
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

  initGAPI() {
    const CLIENT_ID = '203358340372-dklog405glr6pcvq0i2eqokhelsv1lbn.apps.googleusercontent.com';
    
    // Array of API discovery doc URLs for APIs used by the quickstart
    // var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest']
    
    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    // var SCOPES = "https://www.googleapis.com/auth/contacts.readonly";
    const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

    gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));

      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  updateSigninStatus(isSignedIn: boolean) {
    this.loggedIn = isSignedIn;
    this.zone.run(() => {});
  }

  logOut() {
    gapi.auth2.getAuthInstance().signOut();
  }

  logIn() {
    gapi.auth2.getAuthInstance().signIn();
  }
}
