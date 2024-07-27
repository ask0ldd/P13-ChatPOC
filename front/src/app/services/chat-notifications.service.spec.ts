import { TestBed } from '@angular/core/testing';

import { ChatNotificationsService } from './chat-notifications.service';

describe('ChatNotificationsService', () => {
  let service: ChatNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
