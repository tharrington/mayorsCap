import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PoliciesListPageRoutingModule } from './policies-list-routing.module';
import { SharedModule } from '../shared/shared.module';

import { PoliciesListPage } from './policies-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PoliciesListPageRoutingModule,
    SharedModule
  ],
  declarations: [PoliciesListPage]
})
export class PoliciesListPageModule {}
