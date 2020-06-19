import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoliciesDetailPageRoutingModule } from './policies-detail-routing.module';

import { PoliciesDetailPage } from './policies-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoliciesDetailPageRoutingModule
  ],
  declarations: [PoliciesDetailPage]
})
export class PoliciesDetailPageModule {}
