import { Firebase } from './firebase';

export class Dinner extends Firebase {
  name: string;
  recipe: string;
  category: string;
  time: string;
  meals: number;
  image: string;
  uid: string;

  constructor(fields: Partial<Dinner>) {
    super();

    Object.assign(this, fields);
  }
}
