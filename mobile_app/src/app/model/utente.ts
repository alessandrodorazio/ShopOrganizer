// Enum per tipologia ordinamento
enum Ordinamento {
    Distanza = 1,
    Prezzo
}

// Model utente
export class Utente {
    email: string;
    nome: string;
    posizione: string;
    usaPosAttuale: boolean;
    raggioKm: number;
    ordinamento: Ordinamento;

    constructor() {
        this.email = this.nome = this.posizione = '';
        this.usaPosAttuale = true;
        this.raggioKm = 10;
        this.ordinamento = Ordinamento.Prezzo;
    }

    public static get TOKEN_KEY(): string { return 'TOKEN'; }
}
