import { AppStateService } from './../service/appstate.service';
import { Component, OnInit } from '@angular/core';
import { Utente } from '../model/utente';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferenze',
  templateUrl: 'preferenze.page.html',
  styleUrls: ['preferenze.page.scss']
})
export class PreferenzePage implements OnInit {
  infoUtente: Utente;
  token: string;

  constructor(public appState: AppStateService, public router: Router) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    const t = this.appState.get('TOKEN');
    if (t != null) {
      this.token = t;
    } else {
      this.token = null;
      this.router.navigate(['/login']);
    }
  }
}
