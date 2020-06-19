import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivitiesDetailPageRoutingModule } from './activities-detail-routing.module';

import { ActivitiesDetailPage } from './activities-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivitiesDetailPageRoutingModule
  ],
  declarations: [ActivitiesDetailPage]
})
export class ActivitiesDetailPageModule {}
