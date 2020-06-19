import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MayorsUpdatePage } from './mayors-update.page';

const routes: Routes = [
  {
    path: '',
    component: MayorsUpdatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MayorsUpdatePageRoutingModule {}
