import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppStateService } from './service/appstate.service';
import { Utente } from './model/utente';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private appState: AppStateService, 
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      let infoUtente = new Utente();
      if(localStorage.getItem('user') !== null){
        let user = JSON.parse(localStorage.getItem('user'));
        infoUtente.email = user.email;
        infoUtente.nome = user.nome;
        infoUtente.raggioKm = user.raggio_km;
        infoUtente.maxRisultati = user.max_negozi;
        infoUtente.ordinamento = user.preferenza_filtro==1?'PREZZO':'DISTANZA';
        infoUtente.listaSalvata = user.lista[0].prodotti;
      }
      this.appState.add(Utente.UTENTE_KEY, infoUtente);

      this.splashScreen.hide();
    });
  }
}
