import { Firebase } from './firebase';

export class User extends Firebase {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
  mealsCount: number;

  constructor(fields: Partial<User>) {
    super();

    this.displayName = fields.displayName;
    this.email = fields.email;
    this.photoURL = fields.photoURL;
    this.uid = fields.uid;
    this.mealsCount = fields.mealsCount || 6;
    this.id = fields.id;
  }
}
