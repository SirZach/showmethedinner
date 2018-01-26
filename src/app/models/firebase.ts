export class Firebase {
  id: string; // Firebase id

  toJSON(): any {
    return Object.keys(this).reduce((prev, curr) => {
      if (this[curr] !== undefined) {
        prev[curr] = this[curr];
      }

      return prev;
    }, {});
  }
}
