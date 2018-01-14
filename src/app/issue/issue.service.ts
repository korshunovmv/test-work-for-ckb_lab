import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Observer } from 'rxjs/Observer';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';

import { Issue } from '../model/issue.model';
import { DataService } from '../core/data.service';

import { DialogOverviewComponent } from '../../ui/dialog/dialog.component';

@Injectable()
export class IssueService  {
  issues: BehaviorSubject<Issue[]>;
  issueMap: Map<string, Issue>;
  issueBlank: Issue;
  
  constructor(
    private dataService: DataService,
    public dialog: MatDialog,
  ) {
    this.issueMap = new Map();
    this.issues = new BehaviorSubject<Issue[]>([]);
  }
  addNewIssue(issue: Issue): Observable<any> {
    return new Observable((observer) => { 
      this.dataService.addIssue(issue).subscribe(() => {
        this.getIssues().subscribe(() => {});
        observer.next();
      });
    });
  }
  updateIssue(issue: Issue): Observable<any> {
    return new Observable((observer) => { 
      this.dataService.updateIssue(issue).subscribe(() => {
        this.issueBlank = JSON.parse(JSON.stringify(issue));
        this.getIssues().subscribe(() => {});
        observer.next();
      });
    });
  }
  getIssues(): Observable<any> {
    return new Observable((observer) => { 
      this.dataService.getIssues().subscribe((issues: Issue[]) => {
        this.updateList(issues);
        observer.next();
      });
    });
  }
  deleteIssue(issue: Issue | string): Observable<any> {
    return new Observable((observer) => { 
      const id = typeof issue === 'string' ? issue : issue.id;
      this.dataService.deleteIssue(id).subscribe(() => {
        this.getIssues().subscribe(() => {});
        observer.next();
      });
    });
  }
  updateList(rows: Issue[]) {
    for (let i = 0; i < rows.length; ++i) {
      this.setIssue(rows[i].id, rows[i]);
    }
    this.issues.next(rows);
  }
  setIssue(id: string, issue: Issue) {
    this.issueMap.set(id, issue);
  }
  getIssueById(id: string) {
    return this.issueMap.get(id);
  }
  dialogCloseIssue(issue: Issue): Observable<any> {
    return new Observable((observer) => { 
      if (JSON.stringify(issue) !== JSON.stringify(this.issueBlank)) {
        let dialogRef = this.dialog.open(DialogOverviewComponent, {
          data: { title: 'Close issue without save', content: `Do you really want to close this issue without saving?` },
        });
        dialogRef.afterClosed().subscribe(result => {
          observer.next(result);
        });
      } else {
        observer.next(true);
      }
    });
  }
}