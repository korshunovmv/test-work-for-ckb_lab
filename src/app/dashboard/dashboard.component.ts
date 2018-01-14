import { Component, OnInit, AfterViewInit, Inject, ViewChild } from '@angular/core';
import * as moment from 'moment';

import { DataService } from '../core/data.service';
import { IssueService } from '../issue/issue.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatTableDataSource, MatSort, MatSortable} from '@angular/material';

import { Router } from '@angular/router';

import { Issue } from '../model/issue.model';
import { DialogOverviewComponent } from '../../ui/dialog/dialog.component';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  issuesSource = new MatTableDataSource<Issue>();
  actionsWithIssue: Action[];

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private dataService: DataService,
    private issueService: IssueService,
    public dialog: MatDialog,
  ) {
    this.actionsWithIssue = [
      {
        label: 'Sort up',
        icon: 'keyboard_arrow_up',
        disabled: (issue: Issue) => { return issue.sort === 1 },
        handle: (issue: Issue) => { this.sortUpIssue(issue); },
      },
      {
        label: 'Sord down',
        icon: 'keyboard_arrow_down',
        disabled: (issue: Issue) => { return issue.sort === this.issuesSource.data.length},
        handle: (issue: Issue) => { this.sortDownIssue(issue); },
      },
      {
        label: 'Change status to closed',
        icon: 'lock',
        disabled: (issue: Issue) => { return issue.closed },
        handle: (issue: Issue) => { this.setStatusIssueToClosed(issue); },
      },
      {
        label: 'Change status to opened',
        icon: 'lock_open',
        disabled: (issue: Issue) => { return !issue.closed },
        handle: (issue: Issue) => { this.setStatusIssueToOpened(issue); },
      },
      {
        label: 'Delete',
        icon: 'delete',
        disabled: (issue: Issue) => { return false },
        handle: (issue: Issue) => { this.deleteIssue(issue); },
      },
    ];
    this.issueService.issues.subscribe((issues: Issue[]) => {
      this.issuesSource.data = issues;
    });
  }
  ngAfterViewInit() {
    this.issuesSource.sort = this.sort;
  }
  ngOnInit() {
    this.sort.sort(<MatSortable>{
      id: 'sort',
      start: 'asc'
    });
  }
  addNewIssue() {
    this.router.navigate([{ outlets: { issue: 'new' }}]);
  }
  setStatusIssueToClosed(issue: Issue) {
    const tmpIssue = JSON.parse(JSON.stringify(issue));
    tmpIssue.closed = true;
    this.dataService.updateIssue(issue).subscribe(() => {
      issue.closed = true;
    });
  }
  setStatusIssueToOpened(issue: Issue) {
    const tmpIssue = JSON.parse(JSON.stringify(issue));
    tmpIssue.closed = false;
    this.dataService.updateIssue(issue).subscribe(() => {
      issue.closed = false;
    });
  }
  openIssue(issue: Issue) {
    this.router.navigate([{ outlets: { issue: issue.id }}]);
  }
  selectActionWithIssue(issue: Issue, action: Action) {
    action.handle(issue);
  }
  deleteIssue(issue: Issue) {
    let dialogRef = this.dialog.open(DialogOverviewComponent, {
      data: { title: 'Delete issue', content: `Do you really want to delete ${issue.title} ?` },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.issueService.deleteIssue(issue.id).subscribe(() => {
        });
      }
    });
  }
  sortUpIssue(issue: Issue) {
    const oldSort = issue.sort;
    const newSort = issue.sort - 1;
    const issueTmp = this.issuesSource.data.find((item: Issue) => { return item.sort === newSort});
    issue.sort = newSort;
    issueTmp.sort = oldSort;
    this.dataService.updateIssue(issue).subscribe(() => {
      this.dataService.updateIssue(issueTmp).subscribe(() => {
        this.issuesSource.data = this.issuesSource.data;
      });
    });
  }
  sortDownIssue(issue: Issue) {
    const oldSort = issue.sort;
    const newSort = issue.sort + 1;
    const issueTmp = this.issuesSource.data.find((item: Issue) => { return item.sort === newSort});
    issue.sort = newSort;
    issueTmp.sort = oldSort;
    this.dataService.updateIssue(issue).subscribe(() => {
      this.dataService.updateIssue(issueTmp).subscribe(() => {
        this.issuesSource.data = this.issuesSource.data;
      });
    });
  }
  testWarning(issue: Issue): boolean {
    let dateEnd = moment(issue.dateEnd);
    return dateEnd.isBetween(moment().subtract(1, 'd'), moment().add(4, 'd'), 'day');
  }
  testOverdue(issue: Issue): boolean {
    let dateEnd = moment(issue.dateEnd);
    return dateEnd.utc().endOf('day').isBefore(moment().utc().endOf('day'));
  }
  testClosed(issue: Issue): boolean {
    return issue.closed;
  }
}

interface Action {
  label: string;
  icon: string;
  handle: Function;
  disabled: Function;
}
