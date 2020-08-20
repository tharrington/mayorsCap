import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyPageRoutingModule } from './verify-routing.module';
import { SharedModule } from '../shared/shared.module';

import { VerifyPage } from './verify.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyPageRoutingModule,
    SharedModule
  ],
  declarations: [VerifyPage]
})
export class VerifyPageModule {}
