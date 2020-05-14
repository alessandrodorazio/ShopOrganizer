import { Utente } from './../model/utente';
import { AppStateService } from './../service/appstate.service';
import { Preferenze } from './../model/preferenze';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pref: Preferenze = new Preferenze();
  stored = false;
  wereSaved = false;
  status = '';
  canGo = false;

  constructor(private storage: Storage, private appState: AppStateService, private router: Router) { }

  ngOnInit() {
    this.tryToLogin();
  }

  // Commentare questa funzione per evitare il redirect a "preferenze" in caso di token già presente
  ionViewWillEnter() {
    /*const t = this.appState.get('TOKEN');
    if (t != null) {
      this.router.navigate(['/tabs/preferenze']);
    }*/
  }

  tryToLogin() {
    this.storage.get(Preferenze.SHOP_ORGANIZER_PREF_KEY).then((val) => {
      if (val != null) {
        this.pref = val;
        this.stored = true;
        this.wereSaved = true;
        console.log('Preferenze caricate: ' + JSON.stringify(this.pref));
        this.doLogin();
      } else {
        this.stored = false;
        this.wereSaved = false;
        this.status = 'Preferenze non salvate!';
      }
    });
  }

  doLogin() {
    this.canGo = false;
    if (this.pref.email === 'a@a.a' && this.pref.password === 'pass') {
      const token = 'Token-' + Math.random();
      if (this.stored && !this.wereSaved) {
        this.storage.set(Preferenze.SHOP_ORGANIZER_PREF_KEY, this.pref);
        this.wereSaved = true;
        console.log('Prefernze salvate!');
      }
      this.status = 'Login effettuato con successo! Token: [' + token + ']';
      this.appState.add(Utente.TOKEN_KEY, token);
      this.appState.add(Utente.UTENTE_KEY, this.getUtente());
      const u: Utente = this.appState.get(Utente.UTENTE_KEY);
      console.log('Caricati: ' + JSON.stringify(u));
      this.canGo = true;
    } else {
      this.status = 'User/pass non validi!';
      this.appState.clear();
    }
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
