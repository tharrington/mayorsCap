import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivitiesDetailPage } from './activities-detail.page';

describe('ActivitiesDetailPage', () => {
  let component: ActivitiesDetailPage;
  let fixture: ComponentFixture<ActivitiesDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivitiesDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivitiesDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
