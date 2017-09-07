import { Injectable } from '@angular/core';
import { Dinner } from '../dinner';

declare global {
  interface Window { gapi: any; }
}

export interface Sheet {
  rows: Dinner[];
  columns: string[];
}

@Injectable()
export class GoogleDriveService {
  constructor() {}

  sheetId: string = '1nF0WCYV3Gm0_trdjeB_I0FClXpMsZXc-6YliButjpbU';
  sheet: Sheet = {
    rows: [],
    columns: []
  };

  /**
   * Retreive spreadsheet from Google Drive and map it to a Sheet object
   */
  getSheet() {
    let sheet = this.sheet;

    return window.gapi.client.sheets.spreadsheets
      .get({
        spreadsheetId: this.sheetId,
        includeGridData: true
      })
      .then((response: any) => {
        const rows = response.result.sheets[0].data[0].rowData;
        sheet.columns = rows[0].values.map(c => c.formattedValue);
        sheet.rows = rows
          .slice(1)
          .filter(r => r.values.length === sheet.columns.length)
          .map((r) => {
            const dinner = {};
            
            for (let i = 0; i < sheet.columns.length; i++) {
              dinner[sheet.columns[i].toLowerCase()] = r.values[i].formattedValue
            }
            return dinner as Dinner;
          });
      });
  }
}