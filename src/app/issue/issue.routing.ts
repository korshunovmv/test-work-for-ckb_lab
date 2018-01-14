import { NgModule, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';

import { IssueDialogComponent } from './issue-dialog/issue-dialog.component';
import { IssueComponent } from './issue/issue.component';

const routes: Routes = [
  {
    path: ':id',
    component: IssueComponent,
    outlet: 'issue',
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IssueRoutingModule { }