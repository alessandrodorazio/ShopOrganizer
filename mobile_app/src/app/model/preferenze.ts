// Model preferenze (utilizzato per salvare user/pass nello storage del dispositivo)

export class Preferenze {
    email: string;
    password: string;

    constructor() {
        this.email = '';
        this.password = '';
    }

    public static get SHOP_ORGANIZER_PREF_KEY(): string { return 'ShopOrganizer.Pref'; }
}
