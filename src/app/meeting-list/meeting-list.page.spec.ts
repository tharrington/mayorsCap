import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeetingListPage } from './meeting-list.page';

describe('MeetingListPage', () => {
  let component: MeetingListPage;
  let fixture: ComponentFixture<MeetingListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
