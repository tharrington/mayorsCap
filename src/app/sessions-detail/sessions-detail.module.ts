import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionsDetailPageRoutingModule } from './sessions-detail-routing.module';
import { SharedModule } from '../shared/shared.module';

import { SessionsDetailPage } from './sessions-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionsDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [SessionsDetailPage]
})
export class SessionsDetailPageModule {}
