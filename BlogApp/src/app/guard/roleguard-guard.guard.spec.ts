import { TestBed } from '@angular/core/testing';

import { RoleguardGuardGuard } from './roleguard-guard.guard';

describe('RoleguardGuardGuard', () => {
  let guard: RoleguardGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleguardGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
