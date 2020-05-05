import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

import { Product } from '../model/ProductModel';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  products: Product[] = [];
  id = 0;
  prodNameA = ['Tonno', 'Olio', 'Pane', 'Lenticchie', 'Prosciutto', 'Mozzarella', 'Fettine', 'Olive', 'Detersivo', 'Minestrone'];
  prodNameB = ['Oliva', 'Integrale', 'Bianco', 'Fresca', 'Appassita', 'Cotto', 'Crudo', 'Al dente', 'Scelte', 'al Naturale',
               'Sott\'olio', 'Sott\'aceto', 'Liquido', 'Solido'];
  pezzatura = ['3x100g', '1L', '2L', '100g', '200g', '1pz', '500ml', '1Kg'];
  searchText = '';
  prevSearchText = '';

  constructor() {
      this.loadSome();
  }

  // Events...

  loadData(event: any) {
    setTimeout(() => {
      this.loadSome();

      console.log('Done: ' + this.id);
      event.target.complete();

      if (this.products.length >= 100) {
        event.target.disabled = true;
      }
    }, 500);
  }

  doSearch(event: any) {
    console.log('You searched for: ' + this.searchText);
    if (this.searchText === this.prevSearchText) {
      return;
    }

    this.products = [];
    this.id = 0;
    this.infiniteScroll.disabled = false;
    this.loadSome();
    this.prevSearchText = this.searchText;
  }

  // Helpers...

  private loadSome() {
    for (let x = 0; x < this.random(10, 20); x++) {
      let prodName = this.getProductName() + ' (' + this.id + ')';
      if (this.searchText !== '') {
        prodName = this.searchText + ' - ' + prodName;
      }
      this.products.push(new Product(this.id++, prodName, this.getPezzatura(),
                                     this.random(0, 5), '/assets/product/' + this.random(0, 5) + '.jpg'));
    }
  }

  private random(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private getProductName() {
      return this.prodNameA[this.random(0, this.prodNameA.length)] + ' ' + this.prodNameB[this.random(0, this.prodNameB.length)];
  }

  private getPezzatura() {
      return this.pezzatura[this.random(0, this.pezzatura.length)];
  }
}
