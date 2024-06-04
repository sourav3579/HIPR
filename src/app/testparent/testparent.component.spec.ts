import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestparentComponent } from './testparent.component';

describe('TestparentComponent', () => {
  let component: TestparentComponent;
  let fixture: ComponentFixture<TestparentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestparentComponent]
    });
    fixture = TestBed.createComponent(TestparentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
