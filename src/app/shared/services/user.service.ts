import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  User
} from '../../models';

@Injectable()
export class UserService {
  auth: any;
  loggedIn: boolean = false;
  provider: any;
  user: User;
  token: any;

  constructor(
    private zone: NgZone
  ) {}

  init() {

  }

  /**
   * Returns all users from the database
   */
  getUsers(): Promise<User[]> {
    return firebase
      .firestore()
      .collection('users')
      .get()
      .then((querySnapshot) => {
        const users: User[] = [];

        querySnapshot.forEach(doc => users.push(new User(doc.data())));
        return users;
      });
  }

  /**
   * When logging in with Google Auth, check and see if a corresponding
   * user model exists in the database
   * @param user User
   */
  doesUserExist(user: User): Promise<boolean> {
    return this.getUsers()
      .then((users) => {
        const foundUser = users.find(u => u.uid === user.uid);

        if (foundUser) {
          console.debug(`User found`);
          return true;
        }

        throw new Error('User not found');
      });
  }

  /**
   * Retrieve user from the database by id
   * @param id User uid
   */
  getUser(id: string): Promise<User> {
    return Promise.resolve(new User({}));
  }

  /**
   * Add a user to the database
   * @param user User
   */
  addUser(user: User): Promise<User> {
    const data = user.toJSON();
    return firebase
      .firestore()
      .collection('users')
      .add(data)
      .then((snapshot) => {
        user.id = snapshot.id;
        return this.saveUser(user);
      })
      .catch((e) => {
        //TODO add error handling
      });
  }

  /**
   * Persist changes
   * @param user User
   */
  saveUser(user: User): Promise<User> {
    return firebase
      .firestore()
      .doc(`users/${user.id}`)
      .update(user.toJSON());
  }
}
