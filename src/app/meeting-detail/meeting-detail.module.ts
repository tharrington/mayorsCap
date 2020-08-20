import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingDetailPageRoutingModule } from './meeting-detail-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MeetingDetailPage } from './meeting-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeetingDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [MeetingDetailPage]
})
export class MeetingDetailPageModule {}
