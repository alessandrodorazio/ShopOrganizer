import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreferenzePage } from './preferenze.page';

const routes: Routes = [
  {
    path: '',
    component: PreferenzePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenzePageRoutingModule {}
