import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorControlLoginComponent } from './floor-control-login.component';

describe('FloorControlLoginComponent', () => {
  let component: FloorControlLoginComponent;
  let fixture: ComponentFixture<FloorControlLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorControlLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorControlLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
