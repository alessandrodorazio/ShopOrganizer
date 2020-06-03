import { DeactivateService } from './../service/deactivate.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreferenzePage } from './preferenze.page';

const routes: Routes = [
  {
    path: '',
    component: PreferenzePage,
    canDeactivate: [DeactivateService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreferenzePageRoutingModule {}
