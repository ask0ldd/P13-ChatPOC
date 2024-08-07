import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { IChatTimer } from '../interfaces/IChatTimer';

@Injectable({
  providedIn: 'root'
})
export class ChatInactivityTimersService {

  oneMinute : number = 60000
  INACTIVITY_TIMEOUT = 5 * this.oneMinute
  private timers : Map<string, IChatTimer> = new Map();

  constructor() { }

  /**
   * @method startTimer
   * @description Starts an inactivity timer for a specific chat room.
   * @param {string} chatroomId - The ID of the chat room.
   * @returns {void}
   */
  startTimer(chatroomId: string): void{
    this.killTimer(chatroomId)
    const subscription = timer(this.INACTIVITY_TIMEOUT).subscribe(() => {
      this.killTimer(chatroomId)
      this.closeChat(chatroomId)
    })
    this.timers.set(chatroomId, { chatroomId, timerSubscription: subscription })
  }

  /**
   * @method killTimer
   * @description Stops and removes the inactivity timer for a specific chat room.
   * @param {string} chatroomId - The ID of the chat room.
   * @returns {void}
   */
  killTimer(chatroomId: string): void {
    const timer = this.timers.get(chatroomId)
    if (timer) {
      timer.timerSubscription.unsubscribe()
      this.timers.delete(chatroomId)
    }
  }

  /**
   * @method resetTimer
   * @description Resets the inactivity timer for a specific chat room.
   * @param {string} chatroomId - The ID of the chat room.
   * @returns {void}
   */
  resetTimer(chatroomId: string): void {
   this.startTimer(chatroomId)
  }

  /**
   * @method closeChat
   * @description Closes the chat for a given chatroom.
   * @param {string} chatroomId - The ID of the chatroom to close.
   * @returns {void}
   */
  pauseTimer(chatroomId: string): void {
    this.killTimer(chatroomId)
  }

  /**
   * Closes the chat for a given chatroom.
   * @param {string} chatroomId - The ID of the chatroom to close.
   */
  closeChat(chatroomId : string) : void{
    console.log("Closing the conversation...") // should emit back to chat @output()
  }
  
}