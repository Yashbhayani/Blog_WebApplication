import { TestBed } from '@angular/core/testing';

import { UsergurdGuard } from './usergurd.guard';

describe('UsergurdGuard', () => {
  let guard: UsergurdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UsergurdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
