import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaProdottiPage } from './listaprodotti.page';

import { ListaProdottiPageRoutingModule } from './listaprodotti-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ListaProdottiPageRoutingModule
  ],
  declarations: [ListaProdottiPage]
})
export class ListaProdottiPageModule {}
