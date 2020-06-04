import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Utente } from './../model/utente';
import { AppStateService } from './../service/appstate.service';
import { Prodotto } from './../model/prodotto';
import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-listasalvata',
  templateUrl: 'listasalvata.page.html',
  styleUrls: ['listasalvata.page.scss']
})
export class ListaSalvataPage implements OnInit {
  prodotti: Prodotto[] = [];
  infoUtente: Utente = null;

  constructor(private clipboard: Clipboard, private appState: AppStateService,
              private alertController: AlertController, private router: Router) {}

  ngOnInit() { }

  ionViewWillEnter() {
    this.infoUtente = this.appState.get(Utente.UTENTE_KEY);
    if (this.infoUtente === null) {
      this.router.navigate(['/login']);
    } else {
      this.prodotti = this.infoUtente.listaSalvata;
    }
  }

  rimuovi(idx: number) {
    this.prodotti.splice(idx, 1);
  }

  salva(event: any) {
    this.infoUtente.listaSalvata = this.prodotti;
    this.appState.add(Utente.UTENTE_KEY, this.infoUtente);

    const body = {
      user: {
        lista: {
          prodotti: this.infoUtente.listaSalvata.map(e => e.id)
        }
      }
    };

    async function postData(url = '', data = {}) {
      const response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }

    postData('https://shoporganizer.herokuapp.com/public/api/users/' + this.infoUtente.id + '?token=' + this.infoUtente.token, body)
      .then(data => {
        this.infoUtente.id = data.user.id;
        this.infoUtente.token = data.access_token;
        this.infoUtente.email = data.email;
        this.infoUtente.nome = data.user.nome;
        this.infoUtente.raggioKm = data.user.raggio_km;
        this.infoUtente.codiceLista = data.user.lista_codice;
        this.infoUtente.maxRisultati = data.user.max_negozi;
        this.infoUtente.ordinamento = (data.user.preferenza_filtro === 1) ? 'PREZZO' : 'DISTANZA';
        if (data.user.coordinate === null || data.user.coordinate.coordinates[0] === -1) {
          this.infoUtente.usaPosAttuale = true;
          this.infoUtente.lat = -1;
          this.infoUtente.long = -1;
        } else {
          this.infoUtente.usaPosAttuale = false;
          this.infoUtente.lat = data.user.coordinate.coordinates[0];
          this.infoUtente.long = data.user.coordinate.coordinates[1];
        }
        this.infoUtente.firtTime = false;

        this.appState.add(Utente.UTENTE_KEY, this.infoUtente);
    }).catch(err => console.error(err));

    this.notifica('Lista salvata nel profilo.');
  }

  condividi(event: any) {
    const infoUtente = this.appState.get(Utente.UTENTE_KEY);
    this.clipboard.copy('#' + infoUtente.codiceLista);
    this.notifica('Codice della lista copiato negli appunti');
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
}
