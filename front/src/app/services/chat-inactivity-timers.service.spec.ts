import { TestBed } from '@angular/core/testing';

import { ChatInactivityTimersService } from './chat-inactivity-timers.service';

describe('ChatInactivityTimersService', () => {
  let service: ChatInactivityTimersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatInactivityTimersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
