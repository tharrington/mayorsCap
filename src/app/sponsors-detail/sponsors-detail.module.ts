import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SponsorsDetailPageRoutingModule } from './sponsors-detail-routing.module';
import { SharedModule } from '../shared/shared.module';

import { SponsorsDetailPage } from './sponsors-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SponsorsDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [SponsorsDetailPage]
})
export class SponsorsDetailPageModule {}
