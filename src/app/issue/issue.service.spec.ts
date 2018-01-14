import { TestBed, inject } from '@angular/core/testing';

import { IssueService } from './issue.service';
import { DataService } from '../core/data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material';

describe('IssueService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, HttpClientModule, MatDialogModule],
      providers: [
        IssueService,
        DataService,
        {
          provide: MatDialogRef,
          useValue: {}
        }, {
          provide: MAT_DIALOG_DATA,
          useValue: {} // Add any data you wish to test if it is passed/used correctly
        }
      ],
    });
  });

  it('should be created', inject([IssueService], (service: IssueService) => {
    expect(service).toBeTruthy();
  }));
});