import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SponsorsDetailPage } from './sponsors-detail.page';

describe('SponsorsDetailPage', () => {
  let component: SponsorsDetailPage;
  let fixture: ComponentFixture<SponsorsDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsorsDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SponsorsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
