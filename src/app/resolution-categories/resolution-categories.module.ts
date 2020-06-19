import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResolutionCategoriesPageRoutingModule } from './resolution-categories-routing.module';

import { ResolutionCategoriesPage } from './resolution-categories.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResolutionCategoriesPageRoutingModule
  ],
  declarations: [ResolutionCategoriesPage]
})
export class ResolutionCategoriesPageModule {}
