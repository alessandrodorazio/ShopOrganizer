import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DettaglioprodottiPage } from './dettaglioprodotti.page';

const routes: Routes = [
  {
    path: '',
    component: DettaglioprodottiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DettaglioprodottiPageRoutingModule {}
