import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatNotificationsService {

  private notifications = new Set()

  constructor() { }

  pushNotification(chatroomId : string){
    this.notifications.add(chatroomId)
  }

  pullNotification(chatroomId : string){
    this.notifications.delete(chatroomId)
  }

  getNotifications(){
    return this.notifications
  }
}
