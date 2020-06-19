import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommitteesDetailPage } from './committees-detail.page';

describe('CommitteesDetailPage', () => {
  let component: CommitteesDetailPage;
  let fixture: ComponentFixture<CommitteesDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteesDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommitteesDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
