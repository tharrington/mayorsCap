import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResolutionCategoriesPage } from './resolution-categories.page';

const routes: Routes = [
  {
    path: '',
    component: ResolutionCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResolutionCategoriesPageRoutingModule {}
