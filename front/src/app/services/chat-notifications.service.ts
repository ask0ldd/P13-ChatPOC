import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatNotificationsService {

  private notifications = new Set<string>()

  constructor() { }

  pushNotification(chatroomId : string){
    this.notifications.add(chatroomId)
  }

  pullNotification(chatroomId : string){
    this.notifications.delete(chatroomId)
  }

  getNotifications() : Set<string>{
    return this.notifications
  }

  hasNotification(chatroomId : string) : boolean{
    return this.notifications.has(chatroomId)
  }
}
