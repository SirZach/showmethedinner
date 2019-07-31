import { Injectable, NgZone } from '@angular/core';
import {
  Dinner,
  User
} from '../../models';
import { AngularFirestore } from '@angular/fire/firestore';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class FoodService {
  dinners: Dinner[] = [];

  constructor(
    private zone: NgZone,
    private afs: AngularFirestore
  ) {}

  setDinners(dinners: Dinner[]) {
    this.dinners = dinners;
  }

  pushDinner(dinner: Dinner) {
    this.dinners.push(dinner);
  }

  /**
   * Sort dinners alphabetically
   */
  sortDinners() {
    this.dinners.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    
      // names must be equal
      return 0;
    });
  }

  getDinners(uid: string): Promise<Dinner[]> {
    console.debug(`getDinners called with ${uid}`);

    return this.afs
      .collection('dinners', ref => ref.where('uid', '==', uid))
      .get()
      .pipe(
        map((dinnerQuerySnapshot) => {
          this.dinners = [];
          this.dinners = dinnerQuerySnapshot.docs
            .map((d) => {
              return new Dinner(Object.assign({}, d.data(), { id: d.id }));
            });

          this.sortDinners();
          return this.dinners;
        })
      )
      .toPromise();
  }

  updateDinner(dinner: Dinner): Promise<Dinner> {
    return new Promise<Dinner>((resolve, reject) => {
      this.afs
        .collection('dinners')
        .doc(dinner.id)
        .set(dinner.toJSON())
        .then(() => resolve(dinner), err => reject(err));
    });
  }

  createDinner(dinner: Dinner): Promise<Dinner> {
    return new Promise<Dinner>((resolve, reject) => {
      this.afs.collection('dinners')
        .add(dinner.toJSON())
        .then(savedDinner => {
          dinner.id = savedDinner.id;
          this.pushDinner(dinner);
          resolve(dinner);
        }, err => reject(err));
    });
  }

  addDinner(dinner: Dinner): Promise<Dinner> {
    return new Promise<Dinner>((resolve, reject) => {
      this.afs.collection('dinners')
        .add(dinner.toJSON())
        .then(savedDinner => {
          debugger;
          dinner.id = savedDinner.id;
          return dinner;
        }, err => reject(err));
    });
  }

  /**
   * Delete dinner in database and in local cache
   * @param dinner Dinner
   */
  deleteDinner(dinner: Dinner): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afs
        .collection('dinners')
        .doc(dinner.id)
        .delete()
        .then(() => {
          const foundIndex = this.dinners.findIndex(d => d.id === dinner.id);
          this.dinners.splice(foundIndex, 1);
          resolve();
        }, err => reject(err));
    });
  }

  /**
   * Return the number of meals in all dinners
   */
  numberOfMeals(): number {
    return this.dinners.reduce((prev, dinner) => {
      return prev + dinner.meals;
    }, 0);
  }
}
