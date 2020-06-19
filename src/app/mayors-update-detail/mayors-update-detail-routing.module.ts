import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MayorsUpdateDetailPage } from './mayors-update-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MayorsUpdateDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MayorsUpdateDetailPageRoutingModule {}
