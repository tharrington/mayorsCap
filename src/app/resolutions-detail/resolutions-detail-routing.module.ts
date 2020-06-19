import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResolutionsDetailPage } from './resolutions-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ResolutionsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResolutionsDetailPageRoutingModule {}
