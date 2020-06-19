import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResolutionsPageRoutingModule } from './resolutions-routing.module';

import { ResolutionsPage } from './resolutions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResolutionsPageRoutingModule
  ],
  declarations: [ResolutionsPage]
})
export class ResolutionsPageModule {}
