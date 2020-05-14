import { Prodotto } from './prodotto';

// Model utente

export class Utente {
    email: string;
    nome: string;
    indirizzo: string;
    lat: number;
    long: number;
    usaPosAttuale: boolean;
    raggioKm: number;
    maxRisultati: number;
    ordinamento: string;
    listaSalvata: Prodotto[] = [];

    constructor() {
        this.email = this.nome = this.indirizzo = '';
        this.usaPosAttuale = true;
        this.raggioKm = 10;
        this.maxRisultati = 10;
        this.lat = this.long = 0;
        this.ordinamento = 'PREZZO'; // 'DISTANZA'
        this.listaSalvata = [];
    }

    public static get TOKEN_KEY(): string { return 'TOKEN.key'; }
    public static get UTENTE_KEY(): string { return 'UTENTE.key'; }
}
