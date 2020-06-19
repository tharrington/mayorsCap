import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SponsorsDetailPage } from './sponsors-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SponsorsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SponsorsDetailPageRoutingModule {}
