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
  constructor(private appState: AppStateService, private platform: Platform,
              private splashScreen: SplashScreen, private statusBar: StatusBar) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      let infoUtente = new Utente();
      if (this.appState.get(Utente.UTENTE_KEY) !== null) {
        infoUtente = this.appState.get(Utente.UTENTE_KEY);
      } else {
        this.appState.add(Utente.UTENTE_KEY, infoUtente);
      }

      this.splashScreen.hide();
    });
  }
}
