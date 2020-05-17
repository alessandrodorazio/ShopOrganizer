import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaNegoziPage } from './listanegozi.page';

describe('ListaNegoziPage', () => {
  let component: ListaNegoziPage;
  let fixture: ComponentFixture<ListaNegoziPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaNegoziPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaNegoziPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
