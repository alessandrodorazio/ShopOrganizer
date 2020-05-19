import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DettaglioprodottiPageRoutingModule } from './dettaglioprodotti-routing.module';

import { DettaglioprodottiPage } from './dettaglioprodotti.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DettaglioprodottiPageRoutingModule
  ],
  declarations: [DettaglioprodottiPage]
})
export class DettaglioprodottiPageModule {}
