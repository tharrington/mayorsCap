import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommitteesPageRoutingModule } from './committees-routing.module';
import { SharedModule } from '../shared/shared.module';

import { CommitteesPage } from './committees.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommitteesPageRoutingModule,
    SharedModule
  ],
  declarations: [CommitteesPage]
})
export class CommitteesPageModule {}
