import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MayorsPageRoutingModule } from './mayors-routing.module';
import { SharedModule } from '../shared/shared.module';

import { MayorsPage } from './mayors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MayorsPageRoutingModule,
    SharedModule
  ],
  declarations: [MayorsPage]
})
export class MayorsPageModule {}
