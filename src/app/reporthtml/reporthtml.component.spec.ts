import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporthtmlComponent } from './reporthtml.component';

describe('ReporthtmlComponent', () => {
  let component: ReporthtmlComponent;
  let fixture: ComponentFixture<ReporthtmlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporthtmlComponent]
    });
    fixture = TestBed.createComponent(ReporthtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
