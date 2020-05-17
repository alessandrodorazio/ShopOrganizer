import { ProdottoPrezzato } from './prodotto';
import { Point } from './point';

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
    prodotti: ProdottoPrezzato[];

    constructor() {}
}
