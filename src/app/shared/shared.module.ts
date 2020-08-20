import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './components/header/header.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { ActionHeaderComponent } from './components/action-header/action-header.component';
import { SimpleHeaderComponent } from './components/simple-header/simple-header.component';
import { ActionIconHeaderComponent } from './components/action-icon-header/action-icon-header.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SubHeaderComponent,
    ActionHeaderComponent,
    SimpleHeaderComponent,
    ActionIconHeaderComponent
  ],
  exports: [
    HeaderComponent,
    SubHeaderComponent,
    ActionHeaderComponent,
    SimpleHeaderComponent,
    ActionIconHeaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }
