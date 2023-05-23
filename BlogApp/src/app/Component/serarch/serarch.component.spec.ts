import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerarchComponent } from './serarch.component';

describe('SerarchComponent', () => {
  let component: SerarchComponent;
  let fixture: ComponentFixture<SerarchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerarchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerarchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
