import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreferenzePage } from './preferenze.page';

import { PreferenzePageRoutingModule } from './preferenze-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: PreferenzePage }]),
    PreferenzePageRoutingModule,
  ],
  declarations: [PreferenzePage]
})
export class PreferenzePageModule {}
