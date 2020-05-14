import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'listaprodotti',
        loadChildren: () => import('../listaprodotti/listaprodotti.module').then(m => m.ListaProdottiPageModule)
      },
      {
        path: 'listasalvata',
        loadChildren: () => import('../listasalvata/listasalvata.module').then(m => m.ListaSalvataPageModule)
      },
      {
        path: 'preferenze',
        loadChildren: () => import('../preferenze/preferenze.module').then(m => m.PreferenzePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/listaprodotti',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/listaprodotti',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
