import { Firebase } from './firebase';

describe('Firebase Model', () => {
  it('should toJson', () => {
    const model = new Firebase();

    model.id = 'a';

    expect(model.toJSON().id).toBe('a');
  });
});