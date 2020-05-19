import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Utente } from '../model/utente';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user: Utente = new Utente();
  passwordConfirm: string;

  constructor(public navCtrl: NavController, public router: Router, public alertController: AlertController) { }

  ngOnInit() {
  }

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

  validateEmail(email) 
  {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    {
      return (true)
    }
      return (false)
  }

  register() {
    if(this.user.email.length === 0 || this.user.password.length === 0){
      this.missingFields();
      return false;
    }

    if(! this.validateEmail(this.user.email)) {
      this.invalidEmail();
      return false;
    }

    if(this.user.password !== this.passwordConfirm){
      this.passwordDoesntMatch();
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
    
    postData('https://shoporganizer.herokuapp.com/public/api/register', {'email': this.user.email, 'password': this.user.password})
      .then(data => {
        console.log(data); // JSON data parsed by `response.json()` call

        if(data.access_token) {
          localStorage.setItem('token', data.access_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          this.router.navigate(['/preferenze']);
        } else {
          this.emailAlreadyTaken();
        }
        
      }).catch(err => {
        this.emailAlreadyTaken();
        console.error(err);
      });
  }

}
