import { DettaglioprodottiPage } from './dettaglioprodotti/dettaglioprodotti.page';
import { Utente } from './../model/utente';
import { Negozio, NegozioTotale } from './../model/negozio';
import { RemoteService } from './../service/remote.service';
import { ProdottoPrezzato } from './../model/prodotto';
import { AppStateService } from './../service/appstate.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DomSanitizer } from '@angular/platform-browser';

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
  latitude = 0;
  longitude = 0;

  constructor(private sanitize: DomSanitizer, private appState: AppStateService, private remoteService: RemoteService,
              private modalController: ModalController, private geoLoc: Geolocation) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.infoUtente = this.appState.get(Utente.UTENTE_KEY);
    console.log('InfoUtente load: ' + JSON.stringify(this.infoUtente));
    this.selezionati = this.appState.extract('ShopOrganizer.ProdottiSelezionati');
    if (this.selezionati !== null) {
      this.caricaNegozi();
    } else {
      this.loading = false;
    }

    // Estrate posizione corrente o coordinate di preferenza dell'utente
    if (this.infoUtente.usaPosAttuale) {
      this.geoLoc.getCurrentPosition().then((loc) => {
        console.log('Posizione Corrente, lat=' + loc.coords.latitude + '- long=' + loc.coords.longitude);
        this.latitude = loc.coords.latitude;
        this.longitude = loc.coords.longitude;
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    } else {
      this.latitude = this.infoUtente.lat;
      this.longitude = this.infoUtente.long;
    }
  }

  caricaNegozi() {
    this.loading = true;
    this.remoteService.getNegozi().subscribe((data: []) => {
      data.forEach(el => {
        const n = new Negozio();
        console.log(el);

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

        prop = 'coordinate';
        const prop2 = 'coordinates';
        n.coordinate.long = el[prop][prop2][0];
        n.coordinate.lat = el[prop][prop2][1];

        let address = "https://www.google.com/maps/embed/v1/place?q="+el[prop][prop2][1]+","+ el[prop][prop2][0] + "&key=AIzaSyCI5i8GV7gaXt9YuOxohrMfRq-gwhY0hIM&zoom=13"
        n.mapsLink = this.sanitize.bypassSecurityTrustResourceUrl(address);

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
          const prop3 = 'prezzo';
          newProd.prezzo = prodotto[prop][prop3];

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

      nt.distanza = this.calcolaDistanzaInKm(this.latitude, this.longitude, n.coordinate.lat, n.coordinate.long);
      console.log('Distanza = ' + nt.distanza + ', ' + this.infoUtente.raggioKm);
      // Siamo nel raggio massimo richiesto?
      //if (nt.distanza <= this.infoUtente.raggioKm) {
      if(true) {
        this.selezionati.forEach(sel => {
          nt.totale += n.prodotti.filter(p => p.id === sel.id).reduce((tot, el) => {
            return tot + (el.prezzo * sel.quantita);
          }, 0);
        });

        this.risultato.push(nt);
      }
    });
    console.log('Output = ' + JSON.stringify(this.risultato));

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

  aggiustaDistanza(dist: number): string {
    return (dist < 1) ? ((dist * 1000).toFixed(0) + 'm') : (dist.toFixed(2) + 'Km');
  }

  private calcolaDistanzaInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km

    return d;
  }

  private deg2rad(deg: number) {
    return deg * (Math.PI / 180.0);
  }
}
