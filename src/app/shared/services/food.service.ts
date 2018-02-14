import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  Dinner,
  User
} from '../../models';

@Injectable()
export class FoodService {
  dinners: Dinner[] = [];

  constructor(private zone: NgZone) {}

  init() {}

  setDinners(dinners: Dinner[]) {
    this.dinners = dinners;
  }

  pushDinner(dinner: Dinner) {
    console.debug(`dinner added - ${dinner.name}`);
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
    return firebase
      .firestore()
      .collection('dinners')
      .where('uid', '==', uid)
      .get()
      .then((querySnapshot) => {
        this.dinners = [];
        querySnapshot.forEach((doc) => {
          console.debug(doc.data());
          this.pushDinner(new Dinner(Object.assign({}, doc.data(), { id: doc.id })));
        });
        this.sortDinners();

        return this.dinners;
      });
  }

  saveDinner(dinner: Dinner): Promise<Dinner> {
    if (!dinner.id) {
      return this.addDinner(dinner);
    }
    return firebase
      .firestore()
      .doc(`dinners/${dinner.id}`)
      .update(dinner.toJSON());
  }

  addDinner(dinner: Dinner): Promise<Dinner> {
    return firebase
      .firestore()
      .collection('dinners')
      .add(dinner.toJSON())
      .then((d) => {
        dinner.id = d.id;
        return this.saveDinner(dinner);
      });
  }

  /**
   * Delete dinner in database and in local cache
   * @param dinner Dinner
   */
  deleteDinner(dinner: Dinner): Promise<any> {
    return firebase
      .firestore()
      .collection('dinners')
      .doc(dinner.id)
      .delete()
      .then(() => {
        const foundIndex = this.dinners.findIndex(d => d.id === dinner.id);

        this.dinners.splice(foundIndex, 1);
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
