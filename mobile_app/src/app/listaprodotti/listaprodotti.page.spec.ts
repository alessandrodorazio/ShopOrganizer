import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaProdottiPage } from './listaprodotti.page';

describe('ListaProdottiPage', () => {
  let component: ListaProdottiPage;
  let fixture: ComponentFixture<ListaProdottiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListaProdottiPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaProdottiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
