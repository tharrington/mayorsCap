import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeetingDetailPage } from './meeting-detail.page';

describe('MeetingDetailPage', () => {
  let component: MeetingDetailPage;
  let fixture: ComponentFixture<MeetingDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
