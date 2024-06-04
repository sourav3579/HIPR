import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestlifeComponent } from './testlife.component';

describe('TestlifeComponent', () => {
  let component: TestlifeComponent;
  let fixture: ComponentFixture<TestlifeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestlifeComponent]
    });
    fixture = TestBed.createComponent(TestlifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
