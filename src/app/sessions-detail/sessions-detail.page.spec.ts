import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SessionsDetailPage } from './sessions-detail.page';

describe('SessionsDetailPage', () => {
  let component: SessionsDetailPage;
  let fixture: ComponentFixture<SessionsDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionsDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SessionsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
