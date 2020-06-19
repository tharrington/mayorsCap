import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResolutionsDetailPageRoutingModule } from './resolutions-detail-routing.module';

import { ResolutionsDetailPage } from './resolutions-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResolutionsDetailPageRoutingModule
  ],
  declarations: [ResolutionsDetailPage]
})
export class ResolutionsDetailPageModule {}
