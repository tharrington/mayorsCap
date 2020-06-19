import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionsDetailPage } from './sessions-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SessionsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsDetailPageRoutingModule {}
