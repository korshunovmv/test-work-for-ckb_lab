import { Component, OnInit, Input, Inject } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Observer } from 'rxjs/Observer';
import * as moment from 'moment';

import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { IssueService } from '../issue.service';

import { Issue } from '../../model/issue.model';

@Component({
  selector: 'issue-dialog',
  templateUrl: './issue-dialog.component.html',
  styleUrls: ['./issue-dialog.component.scss']
})
export class IssueDialogComponent implements OnInit {
  @Input()
  set issue(value: Issue) {
    this._issue = value;
    this.updateIssueForm();
  }
  get issue(): Issue {
    return this._issue;
  }
  _issue: Issue;

  options: FormGroup;
  busy: boolean;

  public issueForm: FormGroup;

  constructor(
    private issueService: IssueService, 
    fb: FormBuilder,
    public dialogRef: MatDialogRef<IssueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data && data.issue) {
      this.issue = data.issue;
    }
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }
  ngOnInit() {
  }
  updateIssueForm()  {
    this.issueForm = new FormGroup({
      title: new FormControl({ value: this.issue.title, disabled: this.issue.closed}, [Validators.required]),
      description: new FormControl({ value: this.issue.description, disabled: this.issue.closed} ),
      dateEnd: new FormControl({ value: this.issue.dateEnd, disabled: this.issue.closed}, [Validators.required]),
    });
    this.issueForm.valueChanges.subscribe((data) => {
      this.issue = Object.assign(this.issue, data);
    });
  }
  saveIssue(issue: Issue): Observable<any> {
    return new Observable((observer) => {
      this.busy = true;
      this.issueService.updateIssue(issue).subscribe(() => {
        this.busy = false;
        observer.next(true);
      }, () => {
        console.error('Error in save issue');
        this.busy = false;
        observer.next(false);
      });
    });
  }
  saveIssueWithoutObservable() {
    this.saveIssue(this.issue).subscribe(result => {
      if (!result) {
        this.issue = JSON.parse(JSON.stringify(this.issueService.issueBlank));
      }
    })
  }
  getErrorMessageTitle(): string {
    return this.issueForm.controls.title.hasError('required') ? 'You must enter a value' : '';
  }
  getErrorMessageDateEnd(): string {
    if (this.issueForm.controls.dateEnd.hasError('matDatepickerParse')) {
      return `${this.issueForm.controls.dateEnd.getError('matDatepickerParse').text} is not a valid date!`;
    }
    if (this.issueForm.controls.dateEnd.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }
  generatGuid(): string {
    const s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  addIssue(): Observable<any> {
    return new Observable((observer) => { 
      let issue = <Issue>this.issueForm.value;
      issue.id = this.generatGuid();
      issue.sort = this.issueService.issues.getValue().length + 1;
      this.busy = true;
      this.issueService.addNewIssue(issue).subscribe(() => {
        observer.next();
        this.busy = false;
      }, () => {
        console.error('Error in add issue');
        this.busy = false;
      });
    });
  }
  addAndAddAnotherIssue() {
    this.addIssue().subscribe(() => {
      this.issueForm.reset({dateEnd: moment()});
    });
  }
  addIssueWithoutObservable() {
    this.addIssue().subscribe(() => {
      this.close();
    });
  }
  closeWithDialog() {
    this.issueService.dialogCloseIssue(this.issue).subscribe(result => {
      if (result) {
        this.dialogRef.close();  
      }
    });
  }
  close() {
    this.dialogRef.close();  
  }
  changeStatusIssueAtClosed() {
    let issue = JSON.parse(JSON.stringify(this.issueService.issueBlank));
    issue.closed = true;
    this.saveIssue(issue).subscribe(result => {
      if (result) {
        this.issue.closed = true;
        this.issueForm.updateValueAndValidity();
      }
    });
  }
  changeStatusIssueAtOpened() {
    let issue = JSON.parse(JSON.stringify(this.issueService.issueBlank));
    issue.closed = false;
    this.saveIssue(issue).subscribe(result => {
      if (result) {
        this.issue.closed = false;
        this.issueForm.updateValueAndValidity();
      }
    });
  }
}
