import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MayorsUpdatePageRoutingModule } from './mayors-update-routing.module';

import { MayorsUpdatePage } from './mayors-update.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MayorsUpdatePageRoutingModule
  ],
  declarations: [MayorsUpdatePage]
})
export class MayorsUpdatePageModule {}
