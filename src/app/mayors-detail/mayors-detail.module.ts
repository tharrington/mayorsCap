import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MayorsDetailPageRoutingModule } from './mayors-detail-routing.module';

import { MayorsDetailPage } from './mayors-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MayorsDetailPageRoutingModule
  ],
  declarations: [MayorsDetailPage]
})
export class MayorsDetailPageModule {}
