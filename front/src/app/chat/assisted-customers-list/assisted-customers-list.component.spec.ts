import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistedCustomersListComponent } from './assisted-customers-list.component';

describe('AssistedCustomersListComponent', () => {
  let component: AssistedCustomersListComponent;
  let fixture: ComponentFixture<AssistedCustomersListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistedCustomersListComponent]
    });
    fixture = TestBed.createComponent(AssistedCustomersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
