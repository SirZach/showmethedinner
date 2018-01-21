export class Firebase {
  id: string; // Firebase id

  toJSON(): any {
    return Object.keys(this).reduce((prev, curr) => {
      prev[curr] = this[curr];

      return prev;
    }, {});
  }
}