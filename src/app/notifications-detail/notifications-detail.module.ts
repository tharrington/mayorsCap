import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationsDetailPageRoutingModule } from './notifications-detail-routing.module';

import { NotificationsDetailPage } from './notifications-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationsDetailPageRoutingModule
  ],
  declarations: [NotificationsDetailPage]
})
export class NotificationsDetailPageModule {}
