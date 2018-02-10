import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
  AuthService,
  UserService
} from '../../shared/services';
import {
  User
} from '../../models';

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loadingUser: boolean = false;

  constructor(
    private router: Router,
    private $auth: AuthService,
    private $user: UserService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    if (this.$auth.loggedIn) {
      this.router.navigate(['random', this.$auth.user.uid]);
    }
  }

  login() {
    this.loadingUser = true;
    this.$auth.login()
      .then((user: User) => {
        this.$user.getUser(user.uid)
          .then(this.goToDinners.bind(this, user))
          .catch((error) => {
            this.$user.addUser(user)
              .then(this.goToDinners.bind(this, user))
              .catch((error) => {
                this.loadingUser = false;
                // TODO add error handling
              });
          });
      });
  }

  private goToDinners(user: User) {
    this.zone.run(() => { // HAX!!!!!!
      this.router.navigate(['dinners', user.uid]);
    });
  }
}
