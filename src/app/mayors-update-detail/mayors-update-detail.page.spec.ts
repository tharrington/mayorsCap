import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MayorsUpdateDetailPage } from './mayors-update-detail.page';

describe('MayorsUpdateDetailPage', () => {
  let component: MayorsUpdateDetailPage;
  let fixture: ComponentFixture<MayorsUpdateDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MayorsUpdateDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MayorsUpdateDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
