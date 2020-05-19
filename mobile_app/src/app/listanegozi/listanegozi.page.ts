import { DettaglioprodottiPage } from './dettaglioprodotti/dettaglioprodotti.page';
import { Utente } from './../model/utente';
import { Negozio, NegozioTotale } from './../model/negozio';
import { RemoteService } from './../service/remote.service';
import { ProdottoPrezzato } from './../model/prodotto';
import { AppStateService } from './../service/appstate.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-listanegozi',
  templateUrl: './listanegozi.page.html',
  styleUrls: ['./listanegozi.page.scss'],
})
export class ListaNegoziPage implements OnInit {
  selezionati: ProdottoPrezzato[] = [];
  risultato: NegozioTotale[] = [];
  risultatoView: NegozioTotale[] = [];
  negozi: Negozio[] = [];
  negozioDettaglio: Negozio;
  infoUtente: Utente;
  loading: boolean;

  constructor(private appState: AppStateService, private remoteService: RemoteService, private modalController: ModalController) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.infoUtente = this.appState.get(Utente.UTENTE_KEY);
    this.selezionati = this.appState.extract('ShopOrganizer.ProdottiSelezionati');
    if (this.selezionati !== null) {
      this.caricaNegozi();
    } else {
      this.loading = false;
    }
  }

  caricaNegozi() {
    this.loading = true;
    this.remoteService.getNegozi().subscribe((data: []) => {
      data.forEach(el => {
        const n = new Negozio();

        let prop = 'id';
        n.id = el[prop];

        prop = 'nome';
        n.nome = el[prop];

        prop = 'citta';
        n.citta = el[prop];

        prop = 'via';
        n.via = el[prop];

        prop = 'stato';
        n.stato = el[prop];

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

          prop = 'pezzatura';
          newProd.pezzatura = prodotto[prop];

          prop = 'pivot';
          const prop2 = 'prezzo';
          newProd.prezzo = prodotto[prop][prop2];

          n.prodotti.push(newProd);
        });

        this.negozi.push(n);
      });

      this.calcolaTotali();

      this.loading = false;
    });
  }

  calcolaTotali() {
    this.risultato = [];
    this.negozi.forEach(n => {
      const nt: NegozioTotale = n as any;
      nt.totale = 0;
      nt.distanza = this.random(0.1, 20);
      this.selezionati.forEach(sel => {
        nt.totale += n.prodotti.filter(p => p.id === sel.id).reduce((tot, el) => {
          return tot + (el.prezzo * sel.quantita);
        }, 0);
      });

      this.risultato.push(nt);
    });

    this.ordina(null);
  }

  ordina(event: any) {
    // riordina l'elenco in base alla preferenza
    if (event !== null) {
      this.infoUtente.ordinamento = event.target.value;
    }

    if (this.infoUtente.ordinamento === 'PREZZO') {
      this.risultatoView =  Object.assign([], this.risultato.sort((a, b) => {
        const d = a.totale - b.totale;
        // a pari prezzo preferisci la distanza
        return (d === 0) ? (a.distanza - b.distanza) : d;
      }));

      this.risultatoView = this.risultatoView.splice(0, this.infoUtente.maxRisultati);
    } else {
      this.risultatoView = Object.assign([], this.risultato.sort((a, b) => {
        const d = a.distanza - b.distanza;
        // a pari distanza preferisci il prezzo
        return (d === 0) ? (a.totale - b.totale) : d;
      }));

      this.risultatoView = this.risultatoView.splice(0, this.infoUtente.maxRisultati);
    }
  }

  risultatiPresenti(): boolean {
    return ((this.risultato || []).length > 0);
  }

  async showModal() {
    console.log('ok 2!');
    const modal = await this.modalController.create({
      component: DettaglioprodottiPage,
      componentProps: {
        negozio: this.negozioDettaglio,
        selezionati: this.selezionati
      }
    });

    return await modal.present();
  }

  apriDettaglio(id: number) {
    this.negozioDettaglio = this.risultatoView.filter(n => (n.id === id))[0];
    this.showModal();
  }

  // DA ELIMINARE QUANDO VERRANNO RILEVATE LE DISTANZE DALLE API REST (mock)

  private random(minInc: number, maxEsc: number) {
    return Math.floor(Math.random() * (maxEsc - minInc)) + minInc;
  }
}
