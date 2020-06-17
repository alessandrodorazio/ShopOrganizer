import { AppStateService } from './../service/appstate.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Utente } from '../model/utente';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user: Utente = new Utente();
  passwordConfirm: string;

  constructor(private router: Router, private alertController: AlertController, private appState: AppStateService) { }

  ngOnInit() { }

  async emailAlreadyTaken() {
    const alert = await this.alertController.create({
      header: 'Email già in uso',
      message: 'Questa email risulta già utilizzata nei nostri sistemi',
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

  async passwordDoesntMatch() {
    const alert = await this.alertController.create({
      header: 'Errore',
      message: 'Le due password non sono uguali',
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

  validateEmail(email: string) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) ? true : false;
  }

  register() {
    if (this.user.email.length === 0 || this.user.password.length === 0) {
      this.missingFields();
      return false;
    }

    if (!this.validateEmail(this.user.email)) {
      this.invalidEmail();
      return false;
    }

    if (this.user.password !== this.passwordConfirm) {
      this.passwordDoesntMatch();
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
      return response.json(); // parses JSON response into native JavaScript objects
    }

    postData('https://shoporganizer.herokuapp.com/public/api/register', {email: this.user.email, password: this.user.password})
      .then(data => {
        console.log('Register.register.postData.DATA: ' + JSON.stringify(data));

        if (data.access_token) {
          this.appState.remove(Utente.UTENTE_KEY);
          const infoUtente = new Utente();

          infoUtente.id = data.user.id;
          infoUtente.token = data.access_token;
          infoUtente.email = this.user.email;
          infoUtente.nome = data.user.nome;
          infoUtente.raggioKm = data.user.raggio_km;
          infoUtente.maxRisultati = data.user.max_negozi;
          infoUtente.codiceLista = data.user.lista_codice;
          infoUtente.ordinamento = (data.user.preferenza_filtro === 1) ? 'PREZZO' : 'DISTANZA';
          infoUtente.usaPosAttuale = true;
          infoUtente.lat = -1;
          infoUtente.long = -1;
          infoUtente.firtTime = true;

          console.log('Register.register.infoUtente: ' + JSON.stringify(infoUtente));
          this.appState.add(Utente.UTENTE_KEY, infoUtente);
          this.router.navigate(['/tabs/preferenze'], { replaceUrl: true });
        } else {
          this.emailAlreadyTaken();
        }
      })
      .catch(err => {
        this.emailAlreadyTaken();
        console.error('Register.register.postData.ERROR: ' + err);
      });
  }
}
