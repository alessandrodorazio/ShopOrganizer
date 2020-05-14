import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListaSalvataPage } from './listasalvata.page';

describe('ListaSalvataPage', () => {
  let component: ListaSalvataPage;
  let fixture: ComponentFixture<ListaSalvataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListaSalvataPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListaSalvataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
