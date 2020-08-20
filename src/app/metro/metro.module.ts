import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetroPageRoutingModule } from './metro-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MetroPage } from './metro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetroPageRoutingModule,
    SharedModule
  ],
  declarations: [MetroPage]
})
export class MetroPageModule {}
