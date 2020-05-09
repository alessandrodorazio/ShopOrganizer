import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProdottiPage } from './listaprodotti.page';

const routes: Routes = [
  {
    path: '',
    component: ListaProdottiPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaProdottiPageRoutingModule {}
