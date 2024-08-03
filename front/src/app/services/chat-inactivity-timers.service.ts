import { Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { ITimerSubs } from '../interfaces/ITimerSubs';

@Injectable({
  providedIn: 'root'
})
export class ChatInactivityTimersService {

  chatroomsInactivityTimers = new Set<ITimerSubs>()
  oneMinute : number = 60000

  constructor() { }

  /**
   * Starts an inactivity timer for a chatroom.
   * @param {string} chatroomId - The ID of the chatroom.
   * @param {number} [minutes=5] - The number of minutes for the inactivity timer.
   */
  startInactivityTimer(chatroomId : string, minutes : number = 5) {
    if([...this.chatroomsInactivityTimers].findIndex(timer => timer.chatroomId == chatroomId) > 0) {
      this.resetInactivityTimer(chatroomId)
      return
    }
    const timerSubscription = timer(minutes*this.oneMinute, minutes*this.oneMinute).subscribe(
      () => this.closeChat(chatroomId)
    )
    this.chatroomsInactivityTimers.add({chatroomId : chatroomId, timerSubscription : timerSubscription})
  }

  /**
   * Resets the inactivity timer for a chatroom.
   * @param {string} chatroomId - The ID of the chatroom.
   * @param {number} [minutes=5] - The number of minutes for the inactivity timer.
   */
  resetInactivityTimer(chatroomId : string, minutes : number = 5) {
    this.killInactivityTimer(chatroomId)
    this.startInactivityTimer(chatroomId, minutes)
  }

  /**
   * Kills the inactivity timer for a chatroom.
   * @param {string} chatroomId - The ID of the chatroom.
   */
  killInactivityTimer(chatroomId : string) {
    const chatroomsInactivityTimersAsArray = [...this.chatroomsInactivityTimers]
    const chatroomTimerIndex = chatroomsInactivityTimersAsArray.findIndex(timer => timer.chatroomId == chatroomId)
    if(chatroomTimerIndex < 0) return
    chatroomsInactivityTimersAsArray[chatroomTimerIndex].timerSubscription.unsubscribe()
    chatroomsInactivityTimersAsArray.splice(chatroomTimerIndex, 1)
    this.chatroomsInactivityTimers = new Set(chatroomsInactivityTimersAsArray)
  }

  /**
   * Closes the chat for a given chatroom.
   * @param {string} chatroomId - The ID of the chatroom to close.
   */
  closeChat(chatroomId : string){
    console.log("Closing the conversation...")
  }
  
}