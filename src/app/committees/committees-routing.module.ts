import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommitteesPage } from './committees.page';

const routes: Routes = [
  {
    path: '',
    component: CommitteesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommitteesPageRoutingModule {}
