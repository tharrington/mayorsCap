import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivitiesListPage } from './activities-list.page';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitiesListPageRoutingModule {}
