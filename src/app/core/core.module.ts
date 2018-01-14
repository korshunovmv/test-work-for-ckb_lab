import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { DataService } from './data.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    RouterModule,
  ],
  declarations: [],
  exports: [
    HttpModule,
  ],
  providers: [
    DataService,
  ]
})
export class CoreModule {
}
