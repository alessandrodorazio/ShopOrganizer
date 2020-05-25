import { Utente } from './../model/utente';
import { AppStateService } from './../service/appstate.service';
import { Preferenze } from './../model/preferenze';
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

  constructor(private storage: Storage, private appState: AppStateService, private router: Router, public alertController: AlertController, public navCtrl: NavController) { }

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

  validateEmail(email) 
  {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
      return (true)
    }
      return (false)
  }

  doLogin() {
    if(this.user.email.length === 0 || this.user.password.length === 0){
      this.missingFields();
      return false;
    }

    if(! this.validateEmail(this.user.email)) {
      this.invalidEmail();
      return false;
    }

    async function postData(url = '', data = {}) {
      const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
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
    
    postData('https://shoporganizer.herokuapp.com/public/api/login', {'email': this.user.email, 'password': this.user.password})
      .then(data => {
        console.log(data); // JSON data parsed by `response.json()` call

        if(data.access_token) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          this.router.navigate(['/tabs/preferenze']);
        } else {
          this.wrongCredentials();
        }
        
      }).catch(err => console.error(err));

  }

  register() {
    this.router.navigate(['/register']);
  }

  clear() {
    this.storage.remove(Preferenze.SHOP_ORGANIZER_PREF_KEY);
    this.appState.clear();
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
