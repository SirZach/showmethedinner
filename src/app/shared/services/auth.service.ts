import { Injectable, NgZone } from '@angular/core';
import {
  User
} from '../../models';
import { UserService } from './user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable()
export class AuthService {
  auth: any;
  loggedIn: boolean = false;
  provider: any;
  user: User;
  redirectUrl: string;

  constructor(
    private zone: NgZone,
    private $user: UserService,
    private afAuth: AngularFireAuth
  ) {}

  init() {
    this.auth = new auth.GoogleAuthProvider();

    if (this.auth.currentUser) {
      this.loggedIn = true;
      this.user = new User(this.auth.currentUser);
      this.setUserToFirebaseUser();
    }
  }

  /**
   * The user from the authentication is good enough to get the app going
   * But we eventually want to use our firebase user instead of the auth user
   * in order to get the correct metadata about the user
   */
  private setUserToFirebaseUser() {
    this.$user.getUser(this.user.uid  || this.auth.currentUser.uid)
      .then(u => this.user = u);
  }

  /**
   * Authenticate the user with Google Auth
   */
  async login(): Promise<User> {
    try {
      const result = await this.afAuth.auth.signInWithPopup(this.auth);
      this.user = new User(result.user);
      this.loggedIn = true;
      this.zone.run(() => { });
      this.setUserToFirebaseUser();
      return this.user;
    }
    catch (error) {
      // TODO add error handling
      console.log(error);
      throw error;
    }
  }

  /**
   * Sign the user out
   */
  async logout(): Promise<void> {
    try {
      await this.afAuth.auth.signOut();
      this.loggedIn = false;
    }
    catch (error) {
      // TODO add error handling
      console.log(error);
    }
  }
}
