import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitiesDetailPage } from './activities-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesDetailPageRoutingModule {}
