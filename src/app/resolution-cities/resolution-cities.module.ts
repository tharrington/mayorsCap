import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResolutionCitiesPageRoutingModule } from './resolution-cities-routing.module';

import { ResolutionCitiesPage } from './resolution-cities.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResolutionCitiesPageRoutingModule
  ],
  declarations: [ResolutionCitiesPage]
})
export class ResolutionCitiesPageModule {}
