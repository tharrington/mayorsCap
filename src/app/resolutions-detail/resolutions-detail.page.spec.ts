import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResolutionsDetailPage } from './resolutions-detail.page';

describe('ResolutionsDetailPage', () => {
  let component: ResolutionsDetailPage;
  let fixture: ComponentFixture<ResolutionsDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionsDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResolutionsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
