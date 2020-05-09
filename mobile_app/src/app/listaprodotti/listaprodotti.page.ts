import { RemoteService } from './../service/remote-service.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { Prodotto } from '../model/Prodotto';

@Component({
  selector: 'app-tab1',
  templateUrl: 'listaprodotti.page.html',
  styleUrls: ['listaprodotti.page.scss']
})
export class ListaProdottiPage implements OnInit {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  prodotti: Prodotto[] = [];
  tabellaProdotti: Prodotto[] = [];
  tabellaProdottiOriginale: Prodotto[] = [];
  selezionati = new Map<number, number>();
  testoRicerca = '';
  testoRicercaPrecedente = '';
  indiceInizio = 0;

  constructor(public remoteService: RemoteService) {}

  ngOnInit() {
    // Carica prodotti
    this.caricaProdotti();
  }

  // Events...

  caricaAltri(event: any) {
    // simula API rest con 500ms di ritardo
    setTimeout(() => {
      // aggiorna elenco e segnata termine del lavoro...
      this.aggiornaElenco();
      event.target.complete();

      // finito? si, disabilita scrolling
      if (this.prodotti.length === this.tabellaProdotti.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  private aggiornaElenco() {
    if (this.tabellaProdotti.length === 0) { return; }

    // Elementi per pagina
    const EL_PER_PAGINA = 20;

    // Copia la finestra nell'elenco visualizzato...
    for (let i = this.indiceInizio; i < this.min(this.indiceInizio + EL_PER_PAGINA, this.tabellaProdotti.length); i++) {
      this.prodotti.push(this.tabellaProdotti[i]);
    }
    // Aggiorna indice
    this.indiceInizio += EL_PER_PAGINA;
  }

  effettuaRicerca(testo: string) {
    // aggiorna testo di ricerca (il model a volte è lento e risulta non aggiornato)
    this.testoRicerca = testo.trim();
    // Stessa ricerca di prima? Si, termina
    if (this.testoRicerca === this.testoRicercaPrecedente) {
      return;
    }

    // Qualcosa da cercare?
    if (this.testoRicerca.length === 0) {
      // no, mostra tutto
      this.tabellaProdotti = this.tabellaProdottiOriginale;
    } else {
      // si, filtra in base ai criteri
      this.tabellaProdotti = this.tabellaProdottiOriginale.filter(p => this.contiene(p.nome + ' ' + p.marca));
    }

    // reinizializza indici e tabelle visualizate, abilita scrolling e aggiorna elenco
    this.indiceInizio = 0;
    this.prodotti = [];
    this.infiniteScroll.disabled = false;
    this.aggiornaElenco();
    // memorizza ultimo criterio di ricerca utilizzato
    this.testoRicercaPrecedente = this.testoRicerca;
  }

  // Helpers...

  private caricaProdotti() {
    // Avvia l'observable dal servizio per caricare tutti i prodotti...
    return this.remoteService.getProdotti().subscribe((data: []) => {
      data.forEach(element => {
        const p = element as Prodotto;
        // Aggiunge immagine casuale dagli asset
        p.immagine = 'assets/product/' + this.random(0, 6) + '.jpg';
        // Carica nella tabella originale (completa)
        this.tabellaProdottiOriginale.push(p);
        // inizializza mappa delle quantità
        this.selezionati.set(p.id, 0);
      });

      // Inizialmente mostra tutti i prodotti
      this.tabellaProdotti = this.tabellaProdottiOriginale;
      // Aggiorna l'elenco visualizzato
      this.aggiornaElenco();
    });
  }

  private min(a: number, b: number) {
    return (a <= b) ? a : b;
  }

  private contiene(s: string) {
    return (s !== null) ? s.toUpperCase().includes(this.testoRicerca.toUpperCase()) : false;
  }

  // Da eliminare una volta che si hanno gli url delle immagini

  private random(minInc: number, maxEsc: number) {
    minInc = Math.ceil(minInc);
    maxEsc = Math.floor(maxEsc);
    return Math.floor(Math.random() * (maxEsc - minInc)) + minInc;
  }
}
