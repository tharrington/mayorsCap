import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubmittedResolutionsPage } from './submitted-resolutions.page';

const routes: Routes = [
  {
    path: '',
    component: SubmittedResolutionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmittedResolutionsPageRoutingModule {}
