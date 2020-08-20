import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResolutionCategoriesPageRoutingModule } from './resolution-categories-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ResolutionCategoriesPage } from './resolution-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResolutionCategoriesPageRoutingModule,
    SharedModule
  ],
  declarations: [ResolutionCategoriesPage]
})
export class ResolutionCategoriesPageModule {}
