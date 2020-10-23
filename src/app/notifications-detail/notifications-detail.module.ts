import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { IonicModule } from '@ionic/angular';

import { NotificationsDetailPageRoutingModule } from './notifications-detail-routing.module';

import { NotificationsDetailPage } from './notifications-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NotificationsDetailPageRoutingModule
  ],
  declarations: [NotificationsDetailPage]
})
export class NotificationsDetailPageModule {}
