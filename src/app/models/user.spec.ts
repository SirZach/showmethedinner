import { User } from './user';

describe('User Model', () => {
  it('should create user model', () => {
    const user = new User({
      displayName: 'displayName',
      email: 'email',
      photoURL: 'url',
      uid: 'uid',
      mealsCount: 2,
      id: 'id'
    });

    expect(user.displayName).toBe('displayName');
    expect(user.email).toBe('email');
    expect(user.photoURL).toBe('url');
    expect(user.uid).toBe('uid');
    expect(user.mealsCount).toBe(2);
    expect(user.id).toBe('id');
  });
});
