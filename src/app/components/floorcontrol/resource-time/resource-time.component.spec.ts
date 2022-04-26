import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceTimeComponent } from './resource-time.component';

describe('ResourceTimeComponent', () => {
  let component: ResourceTimeComponent;
  let fixture: ComponentFixture<ResourceTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
