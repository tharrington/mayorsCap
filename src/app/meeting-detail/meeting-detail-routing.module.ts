import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetingDetailPage } from './meeting-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MeetingDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingDetailPageRoutingModule {}
