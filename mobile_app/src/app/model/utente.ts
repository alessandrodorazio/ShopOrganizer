import { Prodotto } from './prodotto';

// Model utente

export class Utente {
    id: number;
    token: string;
    email: string;
    nome: string;
    password: string;
    indirizzo: string;
    lat: number;
    long: number;
    usaPosAttuale: boolean;
    raggioKm: number;
    maxRisultati: number;
    ordinamento: string;
    listaSalvata: Prodotto[] = [];
    firtTime: boolean;

    constructor() {
        this.id = 0;
        this.token = null;
        this.email = this.nome = this.indirizzo = this.password = '';
        this.usaPosAttuale = true;
        this.raggioKm = 10;
        this.maxRisultati = 10;
        this.lat = this.long = 0;
        this.ordinamento = 'PREZZO'; // 'DISTANZA'
        this.listaSalvata = [];

        // Utente già configurato
        this.firtTime = false;
    }

    public static get TOKEN_KEY(): string { return 'TOKEN.key'; }
    public static get UTENTE_KEY(): string { return 'UTENTE.key'; }
}
