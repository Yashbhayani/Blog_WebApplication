import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HastagComponent } from './hastag.component';

describe('HastagComponent', () => {
  let component: HastagComponent;
  let fixture: ComponentFixture<HastagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HastagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HastagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
