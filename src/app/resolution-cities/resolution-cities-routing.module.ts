import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResolutionCitiesPage } from './resolution-cities.page';

const routes: Routes = [
  {
    path: '',
    component: ResolutionCitiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResolutionCitiesPageRoutingModule {}
