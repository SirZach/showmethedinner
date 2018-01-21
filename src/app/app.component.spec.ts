// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import {
//   inject,
//   async,
//   TestBed,
//   ComponentFixture,
// } from '@angular/core/testing';
// import { CdkTableModule } from '@angular/cdk';
// import { GoogleDriveService } from './google-drive/google-drive.service';

// /**
//  * Load the implementations that should be tested
//  */
// import { AppComponent } from './app.component';

// describe(`App`, () => {
//   let comp: AppComponent;
//   let fixture: ComponentFixture<AppComponent>;

//   /**
//    * async beforeEach
//    */
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [AppComponent],
//       schemas: [NO_ERRORS_SCHEMA],
//       imports: [CdkTableModule],
//       providers: [GoogleDriveService]
//     })
//     /**
//      * Compile template and css
//      */
//     .compileComponents();
//   }));

//   /**
//    * Synchronous beforeEach
//    */
//   beforeEach(() => {
//     fixture = TestBed.createComponent(AppComponent);
//     comp    = fixture.componentInstance;

//     /**
//      * Trigger initial data binding
//      */
//     fixture.detectChanges();
//   });

//   it(`should be initialized`, () => {
//     expect(fixture).toBeDefined();
//     expect(comp).toBeDefined();
//   });
// });
