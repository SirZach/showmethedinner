import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  User
} from '../../models';

@Injectable()
export class AuthService {
  auth: any;
  loggedIn: boolean = false;
  provider: any;
  user: User;
  token: any;
  redirectUrl: string;

  constructor(
    private zone: NgZone
  ) {}

  init() {
    this.provider = new firebase.auth.GoogleAuthProvider();
    this.auth = firebase.auth();

    if (this.auth.currentUser) {
      this.loggedIn = true;
      this.user = new User(this.auth.currentUser);
    }
  }

  /**
   * Authenticate the user with Google Auth
   */
  login(): Promise<User> {
    return firebase.auth().signInWithPopup(this.provider)
      .then((result) => {
        this.token = result.credential.accessToken;
        this.user = new User(result.user);
        this.loggedIn = true;
        this.zone.run(() => {});
        
        return this.user;
      })
      .catch((error) => {
        // TODO add error handling
        console.log(error);
      });
  }

  /**
   * Sign the user out
   */
  logout(): Promise<boolean> {
    return firebase.auth().signOut()
      .then(() => {
        this.loggedIn = false;
      })
      .catch((error) => {
        // TODO add error handling
        console.log(error);
      });
  }
}
