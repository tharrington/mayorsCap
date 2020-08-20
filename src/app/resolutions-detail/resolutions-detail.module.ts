import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResolutionsDetailPageRoutingModule } from './resolutions-detail-routing.module';
import { SharedModule } from '../shared/shared.module';

import { ResolutionsDetailPage } from './resolutions-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResolutionsDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [ResolutionsDetailPage]
})
export class ResolutionsDetailPageModule {}
