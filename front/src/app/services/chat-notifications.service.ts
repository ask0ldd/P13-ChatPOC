import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatNotificationsService {

  private notifications = new Set<string>()
  public notifications$ = new BehaviorSubject<Set<string>>(new Set<string>())

  constructor() { }

  pushNotification(chatroomId : string){
    this.notifications.add(chatroomId)
    this.notifications$.next(this.notifications)
  }

  pullNotification(chatroomId : string){
    this.notifications.delete(chatroomId)
    this.notifications$.next(this.notifications)
  }
}
