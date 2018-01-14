import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { IssueDialogComponent } from '../issue-dialog/issue-dialog.component';

import { IssueService } from '../issue.service';
import { Issue } from '../../model/issue.model';
import * as moment from 'moment';

@Component({
  selector: 'issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private issueService: IssueService,
  ) {
    this.activatedRoute.params.subscribe((data: any) => {
      if (data['id']) {
        let id:string = data['id'];
        let issue = this.issueService.getIssueById(id);
        if (id !== 'new' && !issue) {
          this.router.navigate([{ outlets: { issue: null }}]);
          return;
        }
        if (id === 'new') {
          issue = <Issue>{id, dateEnd: moment()};
        } else {
          issue = JSON.parse(JSON.stringify(issue));
        }
        this.issueService.issueBlank = JSON.parse(JSON.stringify(issue));
        let dialogRef = this.dialog.open(IssueDialogComponent, {
          width: '40em',
          data: { issue },
        });
        dialogRef.disableClose = true;
        dialogRef.backdropClick().subscribe(() => {
          this.issueService.dialogCloseIssue(issue).subscribe(result => {
            if (result) {
              dialogRef.close();  
            }
          });
        });
    
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate([{ outlets: { issue: null }}]);
        });
      }
    });
  }
}
