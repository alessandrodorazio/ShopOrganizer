import { ProdottoPrezzato } from './../../model/prodotto';
import { NegozioTotale } from './../../model/negozio';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-dettaglioprodotti',
  templateUrl: './dettaglioprodotti.page.html',
  styleUrls: ['./dettaglioprodotti.page.scss'],
})
export class DettaglioprodottiPage implements OnInit {
  negozio: NegozioTotale;
  selezionati: ProdottoPrezzato[];

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  prezzoProdotto(id: number): number {
    const prod = this.negozio.prodotti.filter(p => (p.id === id))[0];
    return prod.prezzo;
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
