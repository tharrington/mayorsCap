import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoliciesDetailPage } from './policies-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PoliciesDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoliciesDetailPageRoutingModule {}
