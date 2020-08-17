import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubmittedResolutionsPage } from './submitted-resolutions.page';

describe('SubmittedResolutionsPage', () => {
  let component: SubmittedResolutionsPage;
  let fixture: ComponentFixture<SubmittedResolutionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedResolutionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmittedResolutionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
