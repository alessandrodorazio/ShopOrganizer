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
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
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
