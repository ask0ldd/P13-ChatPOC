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
    // console.log('pushing notif : ' + chatroomId)
    this.notifications.add(chatroomId)
    // console.log('updated notif : ' + JSON.stringify(this.notifications))
    this.notifications$.next(this.notifications)
  }

  pullNotification(chatroomId : string){
    this.notifications.delete(chatroomId)
    this.notifications$.next(this.notifications)
  }

  /*getNotifications() : Set<string>{
    return this.notifications
  }

  hasNotification(chatroomId : string) : boolean{
    return this.notifications.has(chatroomId)
  }*/
}
