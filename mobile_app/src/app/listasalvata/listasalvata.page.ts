import { AlertController } from '@ionic/angular';
import { Utente } from './../model/utente';
import { AppStateService } from './../service/appstate.service';
import { Prodotto } from './../model/prodotto';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listasalvata',
  templateUrl: 'listasalvata.page.html',
  styleUrls: ['listasalvata.page.scss']
})
export class ListaSalvataPage implements OnInit {
  prodotti: Prodotto[] = [];

  constructor(private appState: AppStateService, private alertController: AlertController) {}

  ngOnInit() { }

  ionViewWillEnter() {
    const infoUtente = this.appState.get(Utente.UTENTE_KEY);
    this.prodotti = infoUtente.listaSalvata;
  }

  rimuovi(idx: number) {
    this.prodotti.splice(idx, 1);
  }

  salva(event: any) {
    const infoUtente = this.appState.get(Utente.UTENTE_KEY);
    infoUtente.listaSalvata = this.prodotti;
    this.appState.add(Utente.UTENTE_KEY, infoUtente);

    let token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('user'));


      let body = {
        "user": {
          "lista": {
            "prodotti": infoUtente.listaSalvata.map(e => e.id)
          }
        }
      };
  
  
      async function postData(url = '', data = {}) {
        const response = await fetch(url, {
          method: 'PUT', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data)
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }

      postData('https://shoporganizer.herokuapp.com/public/api/users/' + user.id + '?token=' + token, body)
        .then(data => {
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(data.user));
          //TODO show alert
        }).catch(err => console.error(err));

    this.notifica('Lista salvata nel profilo.');
  }

  condividi(event: any) {
    // TODO: attuare condivisione

    this.notifica('Lista condivisa!');
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
