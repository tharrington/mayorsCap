import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommitteesPage } from './committees.page';

describe('CommitteesPage', () => {
  let component: CommitteesPage;
  let fixture: ComponentFixture<CommitteesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommitteesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
