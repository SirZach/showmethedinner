import { browser, by, element } from 'protractor';
import 'tslib';

describe('App', () => {

  beforeEach(async () => {
    await browser.get('/');
  });

  it('should have a title', async () => {
    const subject = await browser.getTitle();
    const result  = 'Show Me the Dinner';
    expect(subject).toEqual(result);
  });
});
