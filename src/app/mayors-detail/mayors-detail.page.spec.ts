import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MayorsDetailPage } from './mayors-detail.page';

describe('MayorsDetailPage', () => {
  let component: MayorsDetailPage;
  let fixture: ComponentFixture<MayorsDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MayorsDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MayorsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
