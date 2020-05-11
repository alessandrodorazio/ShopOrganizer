import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreferenzePage } from './preferenze.page';

describe('PreferenzePage', () => {
  let component: PreferenzePage;
  let fixture: ComponentFixture<PreferenzePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreferenzePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreferenzePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
