import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatNotificationsService {

  private notifications = new Set<string>()
  public notifications$ = new BehaviorSubject<Set<string>>(new Set<string>())

  constructor() { }

  /**
   * Adds a new chatroom ID to the notifications set and emits the updated set.
   * @param {string} chatroomId - The ID of the chatroom to add to notifications.
   */
  pushNotification(chatroomId : string){
    this.notifications.add(chatroomId)
    this.notifications$.next(this.notifications)
  }

  /**
   * Removes a chatroom ID from the notifications set and emits the updated set.
   * @param {string} chatroomId - The ID of the chatroom to remove from notifications.
   */
  pullNotification(chatroomId : string){
    this.notifications.delete(chatroomId)
    this.notifications$.next(this.notifications)
  }
}
