// Model prodotto

export class Prodotto {
    id: number;
    codiceean: string;
    marca: string;
    nome: string;
    immagine: string;
    pezzatura: string;
    createdat: Date;
    updatedat: Date;

    constructor() {}
}

export class ProdottoPrezzato extends Prodotto {
    prezzo: number;

    constructor() {
        super();
    }
}
