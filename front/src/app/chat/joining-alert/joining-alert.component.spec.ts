import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoiningAlertComponent } from './joining-alert.component';

describe('JoiningAlertComponent', () => {
  let component: JoiningAlertComponent;
  let fixture: ComponentFixture<JoiningAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JoiningAlertComponent]
    });
    fixture = TestBed.createComponent(JoiningAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
