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
  display = {
    "negoziDaMostrareItem": false,
    "raggioDiRicercaItem": false,
    "ordinamento": false,
  };

  constructor(private appState: AppStateService, private router: Router,
              private nativeGeocoder: NativeGeocoder, private alertController: AlertController) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.token = localStorage.getItem('token');
    if (localStorage.getItem('token') === null) {
      this.router.navigate(['/login']);
    } else {
      let user = JSON.parse(localStorage.getItem('user'));
      this.infoUtente.email = user.email;
      this.infoUtente.nome = user.nome;
      this.infoUtente.raggioKm = user.raggio_km;
      this.infoUtente.maxRisultati = user.max_negozi;
      this.infoUtente.ordinamento = user.preferenza_filtro==1?'PREZZO':'DISTANZA'
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
        this.notifica(error);
      });

    // Codice mock da rimuovere!!
    this.infoUtente.lat = 42.365300;
    this.infoUtente.long = 13.364451;
    this.indirizzoValido = false;
  }

  salva(event: any) {
    // Se assenti usa coordinate mock (0,0) indica di usare  la posizione attuale
    if (this.infoUtente.lat === 0 && this.infoUtente.long === 0) {
      this.infoUtente.lat = 42.365300;
      this.infoUtente.long = 13.364451;
    }

    let token = localStorage.getItem('token');
    let user = JSON.parse(localStorage.getItem('user'));

    let body = {
      "user": {
        "nome": this.infoUtente.nome,
        "raggio_km": this.infoUtente.raggioKm,
        "max_negozi": this.infoUtente.maxRisultati,
        "preferenza_filtro": this.infoUtente.ordinamento==="PREZZO"?1:2,
        "lista": {
          "prodotti": []
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
    console.log('https://shoporganizer.herokuapp.com/public/api/users/' + user.id + '?token=' + token);
    postData('https://shoporganizer.herokuapp.com/public/api/users/' + user.id + '?token=' + token, body)
      .then(data => {
        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(data.user));
        //TODO show alert
      }).catch(err => console.error(err));

    if (this.somethingChanged()) {
      // è più un replace...
      this.appState.add(Utente.UTENTE_KEY, this.infoUtente);
      console.log('InfoUtente: ' + JSON.stringify(this.infoUtente));
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
