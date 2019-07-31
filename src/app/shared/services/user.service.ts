import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {
  User
} from '../../models';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class UserService {
  auth: any;
  loggedIn: boolean = false;
  provider: any;
  user: User;

  constructor(
    private zone: NgZone,
    private afs: AngularFirestore
  ) {}

  init() {}

  /**
   * Retrieve user from the database by id
   * @param uid User uid
   */
  async getUser(uid: string): Promise<User> {
    // return Promise.resolve({} as User);
    try {
      return this.afs.collection('users')
        .get()
        .pipe(map(userQuerySnapshot => {
          const users = userQuerySnapshot.docs.map(u => u.data());
          return users.find(u => u.uid === uid);
        }), map((correctUser) => new User(correctUser)))
        .toPromise();
    }
    catch (e) {
      debugger;
      throw e;
    }
  }

  /**
   * Add a user to the database
   * @param user User
   */
  addUser(user: User): Promise<User> {
    const data = user.toJSON();

    return new Promise<User>((resolve, reject) => {
      return this.afs
        .collection('users')
        .add(user.toJSON())
        .then(userDoc => {
          user.id = userDoc.id;
          resolve(user);
        }, err => reject(err));
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
          return new Promise<User>((resolve, reject) => {
            this.afs
              .collection('users')
              .doc(user.id)
              .update(userToSave)
              .then(() => resolve(user), err => reject(err));
          });
        });
    } else {
      return new Promise<User>((resolve, reject) => {
        this.afs
          .collection('users')
          .doc(user.id)
          .update(user.toJSON())
          .then(() => resolve(user), err => reject(err));
      });
    }
  }
}
