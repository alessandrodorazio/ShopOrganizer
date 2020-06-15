import { AppStateService } from './../service/appstate.service';
import { Component, OnInit } from '@angular/core';
import { Utente } from '../model/utente';
import { Router } from '@angular/router';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';
import { IDeactivatableComponent } from '../service/deactivate.service';

@Component({
  selector: 'app-preferenze',
  templateUrl: 'preferenze.page.html',
  styleUrls: ['preferenze.page.scss']
})
export class PreferenzePage implements OnInit, IDeactivatableComponent {
  infoUtente = new Utente();
  infoUtenteBackup: Utente;
  token: string;
  indirizzo: string;
  indirizzoValido = true;
  nomeValido = false;
  display = {
    negoziDaMostrareItem: false,
    raggioDiRicercaItem: false,
    ordinamento: false,
  };
  performingLogout = false;

  constructor(private appState: AppStateService, private router: Router,
              private nativeGeocoder: NativeGeocoder, private alertController: AlertController) {}

  ngOnInit() {
    this.performingLogout = false;
  }

  ionViewWillEnter() {
    if (this.appState.get(Utente.UTENTE_KEY) === null) {
      this.performingLogout = true;
      this.router.navigate(['/login']);
    } else {
      this.infoUtente = this.appState.get(Utente.UTENTE_KEY);
      this.indirizzo = this.infoUtente.indirizzo;
      console.log('infoUtente Enter = ' + JSON.stringify(this.infoUtente));

      this.nomeValido = (this.infoUtente.nome === null) ? false : (this.infoUtente.nome.length > 0);
      this.backup();
    }
  }

  // Chiamato quando si sta uscendo dalla pagina...
  async canDeactivate(): Promise<boolean> {
    console.log('Preferenze.canDeactivate()');
    if (this.performingLogout) {
      console.log('Preferenze.canDeactivate(): Logout pressed! exiting!');
      this.performingLogout = false;
      return true;
    }

    if (!this.canSave()) {
      // Mostra alert con messaggio
      const notifyAlert = await this.alertController.create({
        header: 'ShopOrganizer',
        message: 'Alcuni campi non sono compilati correttamente!',
        buttons: ['OK']
      });
      // Attende chiusura...
      await notifyAlert.present();
      await notifyAlert.onDidDismiss().then(() => {});
      return false;
    }

    console.log('Preferenze.canDeactivate().isFirstTime = ' + this.infoUtente.firtTime);
    if (this.infoUtente.firtTime) {
      console.log('Preferenze.canDeactivate() is FirstTime!!!!');

      // Mostra alert con messaggio
      const notifyAlert = await this.alertController.create({
        header: 'ShopOrganizer',
        message: 'Completare la configurazione dell\'account prima di proseguire!',
        buttons: ['OK']
      });
      // Attende chiusura...
      await notifyAlert.present();
      await notifyAlert.onDidDismiss().then(() => {});
      return false;
    }

    if (!this.somethingChanged()) {
      console.log('Nessuna modifica...uscita!');
      return true;
    }

    const alert = await this.alertController.create({
        header: 'ShopOrganizer',
        message: 'Hai effettuato modifiche, sicuro di volerle abbandonare?',
        buttons: [{
            text: 'Si',
            handler: () => {
              alert.dismiss(true);
              return false;
            }
        }, {
            text: 'No',
            handler: () => {
              alert.dismiss(false);
              return false;
            }
        }]
    });

    let res: boolean;
    await alert.present();
    await alert.onDidDismiss().then((confrimOut) => {
      res = confrimOut.data;
    });
    console.log('ConfPreferenze.canDeactivate(): ' + res);
    return res;
  }

  canSave() {
    if (!this.nomeValido) { return false; }
    if (this.infoUtente.usaPosAttuale) { return true; }
    if (this.indirizzoValido && this.infoUtente.indirizzo) { return true; }

    return false;
  }

  localizzaIndirizzo(event: any) {
    this.indirizzo = ('' + event.target.value).toUpperCase();
    if (this.indirizzo === this.infoUtente.indirizzo) { return; }

    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };

    this.nativeGeocoder.forwardGeocode(this.indirizzo, options)
      .then((coordinates: any) => {
        this.infoUtente.lat = +coordinates[0].latitude;
        this.infoUtente.long = +coordinates[0].longitude;

        this.nativeGeocoder.reverseGeocode(+coordinates[0].latitude, +coordinates[0].longitude, options)
          .then((result: NativeGeocoderResult[]) => {
            console.log('Address decoded: ' + result[0].locality);
            this.indirizzo = (result[0].thoroughfare + ', ' +  result[0].subThoroughfare + ' ' + result[0].locality).toUpperCase();
            this.infoUtente.indirizzo = this.indirizzo;
            this.indirizzoValido = true;
          })
          .catch((error: any) => {
            console.log('Reverse Geocode: ' + error);
            this.indirizzoValido = false;
            this.notifica(error);
          });
      })
      .catch((error: any) => {
        console.log('Forward Geocode: ' + error);
        this.indirizzoValido = false;
        this.notifica(error);
      });
  }

  aggiornaNomeValido(event: any) {
    this.nomeValido = (!this.infoUtente.nome) ? false : (this.infoUtente.nome.length > 0);
  }

  logout(event: any) {
    this.performingLogout = true;
    this.appState.remove(Utente.UTENTE_KEY);
    this.router.navigate(['/login']);
  }

  salva(event: any) {
    console.log(this.infoUtente)
    if (this.somethingChanged()) {
      const body = {
        user: {
          nome: this.infoUtente.nome,
          raggio_km: this.infoUtente.raggioKm,
          max_negozi: this.infoUtente.maxRisultati,
          preferenza_filtro: (this.infoUtente.ordinamento === 'PREZZO') ? 1 : 2,
          coordinate: (this.infoUtente.usaPosAttuale) ? {
            coordinates: [-1, -1]
          } : {
            coordinates: [this.infoUtente.lat, this.infoUtente.long]
          },
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

      console.log('https://shoporganizer.herokuapp.com/public/api/users/' + this.infoUtente.id + '?token=' + this.infoUtente.token);
      postData('https://shoporganizer.herokuapp.com/public/api/users/' + this.infoUtente.id + '?token=' + this.infoUtente.token, body)
        .then(data => {
          this.backup();
        })
        .catch(err => console.error(err));

      // Prima Configurazione completata...
      this.infoUtente.firtTime = false;
      // è più un replace...
      this.appState.add(Utente.UTENTE_KEY, this.infoUtente);
      console.log('InfoUtente: ' + JSON.stringify(this.infoUtente));
    }
  }

  somethingChanged() {
    const statoOriginale = this.appState.get(Utente.UTENTE_KEY);
    return JSON.stringify(statoOriginale) !== JSON.stringify(this.infoUtente);
  }

  backup() {
    console.log('infoUtenteBackup Prima = ' + JSON.stringify(this.infoUtenteBackup));
    this.infoUtenteBackup = {... this.infoUtente};
    console.log('infoUtenteBackup Dopo = ' + JSON.stringify(this.infoUtenteBackup));
  }

  restore() {
    console.log('infoUtente Prima = ' + JSON.stringify(this.infoUtente));
    this.infoUtente = {... this.infoUtenteBackup};
    console.log('infoUtente Dopo = ' + JSON.stringify(this.infoUtente));
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
