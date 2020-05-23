import { AppStateService } from './../service/appstate.service';
import { Component, OnInit } from '@angular/core';
import { Utente } from '../model/utente';
import { Router } from '@angular/router';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-preferenze',
  templateUrl: 'preferenze.page.html',
  styleUrls: ['preferenze.page.scss']
})
export class PreferenzePage implements OnInit {
  infoUtente = new Utente();
  token: string;
  indirizzoValido = true;

  constructor(private appState: AppStateService, private router: Router,
              private nativeGeocoder: NativeGeocoder, private alertController: AlertController) {}

  ngOnInit() {
  }

  ionViewWillEnter() {

    this.token = localStorage.getItem('token');
    if(localStorage.getItem('token') === null) {
      this.router.navigate(['/login']);
    }else{
      console.log(this.token);
    }
  }

  localizzaIndirizzo(event: any) {
    this.infoUtente.indirizzo = ('' + event.target.value).toUpperCase();

    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 1
    };

    this.nativeGeocoder.forwardGeocode(this.infoUtente.indirizzo, options)
      .then((coordinates: any) => {
        this.infoUtente.lat = coordinates[0].latitude;
        this.infoUtente.long = coordinates[0].longitude;
        this.indirizzoValido = true;
        this.notifica('Coordinate: ' + coordinates[0].latitude + ' ' + coordinates[0].longitude);
      })
      .catch((error: any) => {
        console.log(error);
        this.indirizzoValido = false;
        this.notifica('Indirizzo non trovato!');
      });

    // Codice mock da rimuovere!!
    this.infoUtente.lat = 42.365300;
    this.infoUtente.long = 13.364451;
    this.indirizzoValido = false;
  }

  salva(event: any) {
    if (this.somethingChanged()) {
      // è più un replace...
      this.appState.add(Utente.UTENTE_KEY, this.infoUtente);
    }
  }

  abbandona(event: any) {
    if (this.somethingChanged()) {
      this.conferma();
    }
  }

  somethingChanged() {
    const statoOriginale = this.appState.get(Utente.UTENTE_KEY);
    return JSON.stringify(statoOriginale) !== JSON.stringify(this.infoUtente);
  }

  async conferma() {
    const alert = await this.alertController.create({
      header: 'ShopOrganizer',
      message: 'Hai effettuato modifiche, sicuro di volerle abbandonare?',
      buttons: [{
                  text: 'Si',
                  handler: () => {
                    this.router.navigate(['/tabs/listaprodotti']);
                  }
                },
                {
                  text: 'No',
                  handler: () => {
                    return true;
                  }
                }]
    });

    await alert.present();
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
