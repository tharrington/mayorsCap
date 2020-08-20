import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmittedResolutionsPageRoutingModule } from './submitted-resolutions-routing.module';
import { SharedModule } from '../shared/shared.module';

import { SubmittedResolutionsPage } from './submitted-resolutions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmittedResolutionsPageRoutingModule,
    SharedModule
  ],
  declarations: [SubmittedResolutionsPage]
})
export class SubmittedResolutionsPageModule {}
