import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubmittedResolutionsPageRoutingModule } from './submitted-resolutions-routing.module';

import { SubmittedResolutionsPage } from './submitted-resolutions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmittedResolutionsPageRoutingModule
  ],
  declarations: [SubmittedResolutionsPage]
})
export class SubmittedResolutionsPageModule {}
