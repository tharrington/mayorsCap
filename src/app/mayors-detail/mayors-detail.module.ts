import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MayorsDetailPageRoutingModule } from './mayors-detail-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MayorsDetailPage } from './mayors-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MayorsDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [MayorsDetailPage]
})
export class MayorsDetailPageModule {}
