import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoliciesDetailPage } from './policies-detail.page';

describe('PoliciesDetailPage', () => {
  let component: PoliciesDetailPage;
  let fixture: ComponentFixture<PoliciesDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliciesDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoliciesDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
