import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MayorsUpdatePageRoutingModule } from './mayors-update-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MayorsUpdatePage } from './mayors-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MayorsUpdatePageRoutingModule,
    SharedModule
  ],
  declarations: [MayorsUpdatePage]
})
export class MayorsUpdatePageModule {}
