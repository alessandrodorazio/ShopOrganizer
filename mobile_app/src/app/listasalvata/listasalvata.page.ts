import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
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

  constructor(private clipboard: Clipboard, private appState: AppStateService, private toastController: ToastController,
              private alertController: AlertController, private router: Router) {}

  ngOnInit() { }

  ionViewWillEnter() {
    this.infoUtente = this.appState.get(Utente.UTENTE_KEY);
    if (this.infoUtente === null) {
      this.router.navigate(['/login'], { replaceUrl: true });
    } else {
      // Importa lista...
      this.prodotti = this.infoUtente.listaSalvata;
      // Se veniamo da un salvataggio, avvisa e pulisci evento...
      if (this.appState.get('LISTA_SALVATA_SAVED')) {
        this.appState.remove('LISTA_SALVATA_SAVED');
        this.presentToast('I prodotti selezionati sono stati aggiunti alla lista!');
      }
    }
  }

  rimuovi(idx: number) {
    this.prodotti.splice(idx, 1);
  }

  salva(event: any) {
    this.infoUtente.listaSalvata = this.prodotti;
    this.appState.add(Utente.UTENTE_KEY, this.infoUtente);

    const prodList = this.infoUtente.listaSalvata.map(e => e.id);
    const body = {
      user: {
        lista: {
          prodotti: prodList
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
      return response.json();
    }

    postData('https://shoporganizer.herokuapp.com/public/api/users/' + this.infoUtente.id + '?token=' + this.infoUtente.token, body)
      .then(data => {
        console.log('SALVATOOOO');
    }).catch(err => console.error('listasalvata.salva ERROR: ' + err));

    this.notifica('Lista salvata nel profilo.');
  }

  condividi(event: any) {
    const infoUtente = this.appState.get(Utente.UTENTE_KEY);
    this.clipboard.copy('#' + infoUtente.codiceLista);
    this.notifica('Codice della lista copiato negli appunti');
  }

  importaLista(event: any) {
    this.appState.add('CODICE_LISTA', this.infoUtente.codiceLista);
    this.router.navigate(['/tabs/listaprodotti']);
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

  async presentToast(msg: string, expire = 2000) {
    const toast = await this.toastController.create({
      message: msg,
      duration: expire
    });
    toast.present();
  }
}
