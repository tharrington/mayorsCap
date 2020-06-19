import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitteesDetailPage } from './committees-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CommitteesDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitteesDetailPageRoutingModule {}
