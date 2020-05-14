import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListaSalvataPage } from './listasalvata.page';

import { ListaSalvataPageRoutingModule } from './listasalvata-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ListaSalvataPageRoutingModule
  ],
  declarations: [ListaSalvataPage]
})
export class ListaSalvataPageModule {}
