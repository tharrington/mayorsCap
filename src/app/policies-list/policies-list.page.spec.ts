import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PoliciesListPage } from './policies-list.page';

describe('PoliciesListPage', () => {
  let component: PoliciesListPage;
  let fixture: ComponentFixture<PoliciesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliciesListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PoliciesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
