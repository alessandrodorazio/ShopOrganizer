import { AlertController } from '@ionic/angular';
import { Utente } from './../model/utente';
import { AppStateService } from './../service/appstate.service';
import { Prodotto } from './../model/prodotto';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listasalvata',
  templateUrl: 'listasalvata.page.html',
  styleUrls: ['listasalvata.page.scss']
})
export class ListaSalvataPage implements OnInit {
  prodotti: Prodotto[] = [];

  constructor(private appState: AppStateService, private alertController: AlertController) {}

  ngOnInit() { }

  ionViewWillEnter() {
    const infoUtente = this.appState.get(Utente.UTENTE_KEY);
    this.prodotti = infoUtente.listaSalvata;
  }

  rimuovi(idx: number) {
    this.prodotti.splice(idx, 1);
  }

  salva(event: any) {
    const infoUtente = this.appState.get(Utente.UTENTE_KEY);
    infoUtente.listaSalvata = this.prodotti;
    this.appState.add(Utente.UTENTE_KEY, infoUtente);

    // TODO: chiamare REST per salvataggio

    this.notifica('Lista salvata nel profilo.');
  }

  condividi(event: any) {
    // TODO: attuare condivisione

    this.notifica('Lista condivisa!');
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
