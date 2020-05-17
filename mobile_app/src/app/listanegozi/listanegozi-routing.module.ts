import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaNegoziPage } from './listanegozi.page';

const routes: Routes = [
  {
    path: '',
    component: ListaNegoziPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaNegoziPageRoutingModule {}
