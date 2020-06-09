import { ProdottoPrezzato } from './prodotto';
import { Point } from './point';
import { SafeResourceUrl } from '@angular/platform-browser';

export class Negozio {
    id: number;
    nome: string;
    via: string;
    citta: string;
    cap: string;
    stato: string;
    createdat: Date;
    updatedat: Date;
    coordinate: Point;
    mapsLink: SafeResourceUrl;
    prodotti: ProdottoPrezzato[];

    constructor() {
        this.coordinate = new Point();
    }
}

export class NegozioTotale extends Negozio {
    totale: number;
    distanza: number;

    constructor() {
        super();
    }
}
