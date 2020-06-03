import { Utente } from './../model/utente';
import { AppStateService } from './../service/appstate.service';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: Utente = new Utente();
  stored = false;
  wereSaved = false;
  status = '';
  canGo = false;

  constructor(private storage: Storage, private appState: AppStateService, private router: Router,
              private alertController: AlertController, private navCtrl: NavController) { }

  ngOnInit() {}

  async wrongCredentials() {
    const alert = await this.alertController.create({
      header: 'Credenziali errate',
      message: 'La combinazione email/password non è corretta. Riprova',
      buttons: ['OK']
    });

    await alert.present();
  }

  async invalidEmail() {
    const alert = await this.alertController.create({
      header: 'Email non valida',
      message: 'Inserisci una email valida',
      buttons: ['OK']
    });

    await alert.present();
  }

  async missingFields() {
    const alert = await this.alertController.create({
      header: 'Campi mancanti',
      message: 'Compila tutti i campi e riprova',
      buttons: ['OK']
    });

    await alert.present();
  }

  async undefinedError() {
    const alert = await this.alertController.create({
      header: 'Errore sconosciuto',
      message: 'Si è verificato un errore sconosciuto. Riprova più tardi',
      buttons: ['OK']
    });

    await alert.present();
  }

  validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }

    return false;
  }

  doLogin() {
    if (this.user.email.length === 0 || this.user.password.length === 0) {
      this.missingFields();
      return false;
    }

    if (!this.validateEmail(this.user.email)) {
      this.invalidEmail();
      return false;
    }

    async function postData(url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST',
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

    postData('https://shoporganizer.herokuapp.com/public/api/login', {email: this.user.email, password: this.user.password})
      .then(data => {
        console.log('Logged in: ' + JSON.stringify(data)); // JSON data parsed by `response.json()` call

        if (data.access_token) {
          const infoUtente = new Utente();

          infoUtente.id = data.user.id;
          infoUtente.token = data.access_token;
          infoUtente.email = this.user.email;
          infoUtente.nome = data.user.nome;
          infoUtente.raggioKm = data.user.raggio_km;
          infoUtente.maxRisultati = data.user.max_negozi;
          infoUtente.ordinamento = (data.user.preferenza_filtro === 1) ? 'PREZZO' : 'DISTANZA';
          if (data.user.coordinate === null) {
            infoUtente.usaPosAttuale = true;
            infoUtente.lat = -1;
            infoUtente.long = -1;
          } else {
            infoUtente.usaPosAttuale = false;
            infoUtente.lat = data.user.coordinate.lat;
            infoUtente.long = data.user.coordinate.long;
          }
          infoUtente.firtTime = false;

          this.appState.add(Utente.UTENTE_KEY, infoUtente);
          this.router.navigate(['/tabs/preferenze']);
        } else {
          this.wrongCredentials();
        }
      })
      .catch(err => console.error(err));
  }

  register() {
    this.router.navigate(['/register']);
  }

  clear() {
    this.wereSaved = false;
    window.location.reload();
  }

  getUtente() {
    const u = new Utente();
    u.nome = 'Riccardo';
    u.email = 'a@a.a';
    return u;
  }
}
