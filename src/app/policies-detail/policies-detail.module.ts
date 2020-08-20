import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoliciesDetailPageRoutingModule } from './policies-detail-routing.module';
import { SharedModule } from '../shared/shared.module';

import { PoliciesDetailPage } from './policies-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoliciesDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [PoliciesDetailPage]
})
export class PoliciesDetailPageModule {}
