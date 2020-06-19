import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MayorsDetailPage } from './mayors-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MayorsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MayorsDetailPageRoutingModule {}
