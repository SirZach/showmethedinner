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

  init() {}

  /**
   * Retrieve user from the database by id
   * @param uid User uid
   */
  getUser(uid: string): Promise<User> {
    return firebase
      .firestore()
      .collection('users')
      .where('uid', '==', uid)
      .get()
      .then((querySnapshot) => {
        const users: User[] = [];

        if (!querySnapshot.docs.length) {
          throw new Error(`User with uid = ${uid} does not exist`);
        }
        
        querySnapshot.forEach(doc => users.push(new User(doc.data())));
        return users[0];
      });
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
        // TODO add error handling
      });
  }

  /**
   * Persist changes
   * @param user User
   */
  saveUser(user: User): Promise<User> {
    if (!user.id) {
      this.getUser(user.uid)
        .then((u) => {
          const userToSave = Object.assign({}, u.toJSON(), user.toJSON());
          
          return firebase
            .firestore()
            .doc(`users/${u.id}`)
            .update(userToSave);
        });
    } else {
      return firebase
        .firestore()
        .doc(`users/${user.id}`)
        .update(user.toJSON());
    }
  }
}
