import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResolutionsPage } from './resolutions.page';

describe('ResolutionsPage', () => {
  let component: ResolutionsPage;
  let fixture: ComponentFixture<ResolutionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolutionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResolutionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
