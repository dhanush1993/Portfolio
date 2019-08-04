import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundComponentComponent } from './background-component.component';

describe('BackgroundComponentComponent', () => {
  let component: BackgroundComponentComponent;
  let fixture: ComponentFixture<BackgroundComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackgroundComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackgroundComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
