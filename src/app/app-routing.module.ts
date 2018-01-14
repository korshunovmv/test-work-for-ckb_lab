import { NgModule }             from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd, ActivatedRoute, RoutesRecognized } from '@angular/router';

import { Title } from '@angular/platform-browser';

import { DashboardComponent }    from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
  baseTitle = 'My app';
  constructor(
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        const root = event.state.root;
        if (!root.children) {
          return;
        }
        for (const child of root.children) {
          switch (child.outlet) {
            case 'primary':
              switch (child.routeConfig.path) {
                case 'dashboard':
                  this.title.setTitle(`${this.baseTitle} | Dashboard`);
                  break;
              }
              break;
            case 'issue':
              this.title.setTitle(`${this.baseTitle} | Issue - ${child.params['id']}`);
              break;
          }
        }
      }        
    });
  }
}
