import { Negozio } from './../model/negozio';
import { RemoteService } from './../service/remote.service';
import { Prodotto, ProdottoPrezzato } from './../model/prodotto';
import { Router } from '@angular/router';
import { AppStateService } from './../service/appstate.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listanegozi',
  templateUrl: './listanegozi.page.html',
  styleUrls: ['./listanegozi.page.scss'],
})
export class ListaNegoziPage implements OnInit {
  selezionati: Prodotto[] = [];
  negozi: Negozio[] = [];

  constructor(private appState: AppStateService, private remoteService: RemoteService, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.selezionati = this.appState.extract('ShopOrganizer.ProdottiSelezionati');
    this.caricaNegozi();
  }

  caricaNegozi() {
    this.remoteService.getNegozi().subscribe((data: []) => {
      data.forEach(el => {
        const n = new Negozio();

        let prop = 'id';
        n.id = el[prop];

        prop = 'nome';
        n.nome = el[prop];

        // copia i prodotti
        prop = 'prodotti';
        const prodotti = el[prop] as [];

        n.prodotti = [];
        prodotti.forEach(prodotto => {
          const newProd = new ProdottoPrezzato();

          prop = 'id';
          newProd.id = prodotto[prop];

          prop = 'nome';
          newProd.nome = prodotto[prop];

          prop = 'marca';
          newProd.marca = prodotto[prop];

          prop = 'pivot';
          const prop2 = 'prezzo';
          newProd.prezzo = prodotto[prop][prop2];

          n.prodotti.push(newProd);
        });

        this.negozi.push(n);
      });

      console.log('Negozi = ' + JSON.stringify(this.negozi));
      this.calcola();
    });
  }

  calcola() {

  }
}
