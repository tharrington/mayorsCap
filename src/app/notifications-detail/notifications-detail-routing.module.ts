import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotificationsDetailPage } from './notifications-detail.page';

const routes: Routes = [
  {
    path: '',
    component: NotificationsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsDetailPageRoutingModule {}
