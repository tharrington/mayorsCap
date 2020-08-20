import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommitteesDetailPageRoutingModule } from './committees-detail-routing.module';
import { SharedModule } from '../shared/shared.module';

import { CommitteesDetailPage } from './committees-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommitteesDetailPageRoutingModule,
    SharedModule
  ],
  declarations: [CommitteesDetailPage]
})
export class CommitteesDetailPageModule {}
