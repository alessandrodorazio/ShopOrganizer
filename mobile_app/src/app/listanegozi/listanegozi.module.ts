import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaNegoziPageRoutingModule } from './listanegozi-routing.module';

import { ListaNegoziPage } from './listanegozi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaNegoziPageRoutingModule
  ],
  declarations: [ListaNegoziPage]
})
export class ListaNegoziPageModule {}
