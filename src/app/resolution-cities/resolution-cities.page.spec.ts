import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResolutionCitiesPage } from './resolution-cities.page';

describe('ResolutionCitiesPage', () => {
  let component: ResolutionCitiesPage;
  let fixture: ComponentFixture<ResolutionCitiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionCitiesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResolutionCitiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
