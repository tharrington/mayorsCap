import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResolutionsPage } from './resolutions.page';

const routes: Routes = [
  {
    path: '',
    component: ResolutionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResolutionsPageRoutingModule {}
