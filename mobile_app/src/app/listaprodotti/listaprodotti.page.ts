import { ProdottoPrezzato } from './../model/prodotto';
import { Router } from '@angular/router';
import { Utente } from './../model/utente';
import { AppStateService } from './../service/appstate.service';
import { RemoteService } from '../service/remote.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { IonInfiniteScroll, AlertController } from '@ionic/angular';

import { Prodotto } from '../model/prodotto';

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
  loading: boolean;
  soloSelezionati = false;
  elementiSelezionati = false;

  constructor(private remoteService: RemoteService, private alertController: AlertController,
              private appState: AppStateService, private router: Router) {}

  ngOnInit() {
    // Carica prodotti
    this.caricaProdotti(null);
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

  calcola(event: any) {
    console.log('Avvia calcolo...');
     // salva la lista
    const daSalvare = [];
    // Estrae e copia i prodotti selezionati senza quantità
    this.selezionati.forEach((qty: number, id: number) => {
      if (qty > 0) {
        const toSave: ProdottoPrezzato = this.tabellaProdottiOriginale.filter(p => p.id === id)[0] as any;
        toSave.quantita = qty;
        daSalvare.push(toSave);
      }
    });

    this.appState.add('ShopOrganizer.ProdottiSelezionati', daSalvare);
    this.router.navigate(['/listanegozi']);
  }

  salvaLista(event: any) {
    // salva la lista
    const daSalvare = [];
    // Estrae e copia i prodotti selezionati senza quantità
    this.selezionati.forEach((qty: number, id: number) => {
      if (qty > 0) {
        daSalvare.push(this.tabellaProdottiOriginale.filter(p => p.id === id)[0]);
      }
    });

    // Almeno uno estratto?
    if (daSalvare.length === 0) {
      this.notifica('Selezionare almeno un prodotto!');
    } else {
      // Si, aggiorna stato utente
      const infoUtente = this.appState.get(Utente.UTENTE_KEY);
      infoUtente.listaSalvata = daSalvare;
      this.appState.add(Utente.UTENTE_KEY, infoUtente);

      this.router.navigate(['/tabs/listasalvata']);
    }
  }

  mostraSelezionati(event: any) {
    this.soloSelezionati = !this.soloSelezionati;

    if (this.soloSelezionati) {
      this.prodotti = [];

      this.selezionati.forEach((qty: number, id: number) => {
        if (qty > 0) {
          this.prodotti.push(this.tabellaProdottiOriginale.filter(p => p.id === id)[0]);
        }
      });
    } else {
      this.prodotti = this.tabellaProdotti;
    }
  }

  aggiornaSelezione() {
    this.elementiSelezionati = Array.from(this.selezionati.values()).some(qty => qty > 0);
  }

  selezionaProdotto(id: number, event: any) {
    console.log('selezionaProdotto: ' + id + ' = ' + event);
    if (event !== null) {
      this.selezionati.set(id, event);
      this.aggiornaSelezione();
    }
  }

  // Helpers...

  caricaProdotti(event: any) {
    // Pull-to-refresh?
    if (event === null) {
      // No, primo caricamento...
      this.loading = true;
    } else {
      // Si, svuota tutto (pull-to-refresh)
      this.tabellaProdottiOriginale = this.tabellaProdotti = this.prodotti = [];
    }

    // Avvia l'observable dal servizio per caricare tutti i prodotti...
    this.remoteService.getProdotti().subscribe((data: []) => {
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

      setTimeout(() => {
        // Se abbiamo effettuato un pull-to-refresh notifica termine
        if (event != null) {
          event.target.complete();
        }
        // Finito
        this.loading = false;
      }, 500);
    });
  }

  private min(a: number, b: number) {
    return (a <= b) ? a : b;
  }

  private contiene(s: string) {
    return (s !== null) ? s.toUpperCase().includes(this.testoRicerca.toUpperCase()) : false;
  }

  async notifica(testo: string) {
    // Mostra alert con messaggio
    const alert = await this.alertController.create({
      header: 'ShopOrganizer',
      message: testo,
      buttons: ['OK']
    });
    // Attende chiusura...
    await alert.present();
  }

  // Da eliminare una volta che si hanno gli url delle immagini

  private random(minInc: number, maxEsc: number) {
    minInc = Math.ceil(minInc);
    maxEsc = Math.floor(maxEsc);
    return Math.floor(Math.random() * (maxEsc - minInc)) + minInc;
  }
}
