import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeetingListPageRoutingModule } from './meeting-list-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MeetingListPage } from './meeting-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeetingListPageRoutingModule,
    SharedModule
  ],
  declarations: [MeetingListPage]
})
export class MeetingListPageModule {}
