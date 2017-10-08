import { GoogleDriveService } from './google-drive.service';
import { TestData } from './test-data';

describe('GoogleDriveService', () => {
  let service: GoogleDriveService;

  beforeEach(() => service = new GoogleDriveService());

  it('should call gapi when getting sheet', (done) => {
    const gapi = {
      client: {
        sheets: {
          spreadsheets: {
            get: () => Promise.resolve(TestData.getData())
          }
        }
      }
    };
    window.gapi = gapi;
    const gapiSpy = spyOn(window.gapi.client.sheets.spreadsheets, 'get').and.callThrough();

    service.getSheet()
      .then((response) => {
        expect(service.sheet.rows.length).toBe(24);
        expect(service.sheet.columns.length).toBe(6);
        
        const dinner = service.sheet.rows[0];
        expect(dinner.category).toBe('chicken');
        expect(dinner.meals).toBe(2);
        expect(dinner.name).toBe('Buffalo Mac and Cheese');
        expect(dinner.servings).toBe('4');
        expect(dinner.time).toBe('90');
        done();
      });
  });
});
