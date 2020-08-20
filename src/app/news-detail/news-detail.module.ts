import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsDetailPageRoutingModule } from './news-detail-routing.module';
import { SharedModule } from '../shared/shared.module';

import { NewsDetailPage } from './news-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [NewsDetailPage]
})
export class NewsDetailPageModule {}
