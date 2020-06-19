import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MayorsUpdateDetailPageRoutingModule } from './mayors-update-detail-routing.module';

import { MayorsUpdateDetailPage } from './mayors-update-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MayorsUpdateDetailPageRoutingModule
  ],
  declarations: [MayorsUpdateDetailPage]
})
export class MayorsUpdateDetailPageModule {}
