import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivitiesListPage } from './activities-list.page';

describe('ActivitiesListPage', () => {
  let component: ActivitiesListPage;
  let fixture: ComponentFixture<ActivitiesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
