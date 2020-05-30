import { IonicModule } from '@ionic/angular';
import { DistanzaPipe } from './distanza.pipe';
import { NgModule } from '@angular/core';

@NgModule({
    imports:        [ IonicModule ],
    declarations:   [ DistanzaPipe ],
    exports:        [ DistanzaPipe ],
})
export class PipesModule {}
