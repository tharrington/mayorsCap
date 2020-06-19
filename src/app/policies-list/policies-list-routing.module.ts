import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoliciesListPage } from './policies-list.page';

const routes: Routes = [
  {
    path: '',
    component: PoliciesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PoliciesListPageRoutingModule {}
