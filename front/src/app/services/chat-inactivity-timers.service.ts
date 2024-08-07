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

  /*startInactivityTimer(chatroomId : string, minutes : number = 5) {
    if([...this.chatroomsInactivityTimers].findIndex(timer => timer.chatroomId == chatroomId) > 0) {
      this.resetInactivityTimer(chatroomId)
      return
    }
    const timerSubscription = timer(minutes*this.oneMinute, minutes*this.oneMinute).subscribe(
      () => this.closeChat(chatroomId)
    )
    this.chatroomsInactivityTimers.add({chatroomId : chatroomId, timerSubscription : timerSubscription})
  }

  resetInactivityTimer(chatroomId : string, minutes : number = 5) {
    this.killInactivityTimer(chatroomId)
    this.startInactivityTimer(chatroomId, minutes)
  }

  killInactivityTimer(chatroomId : string) {
    const chatroomsInactivityTimersAsArray = [...this.chatroomsInactivityTimers]
    const chatroomTimerIndex = chatroomsInactivityTimersAsArray.findIndex(timer => timer.chatroomId == chatroomId)
    if(chatroomTimerIndex < 0) return
    chatroomsInactivityTimersAsArray[chatroomTimerIndex].timerSubscription.unsubscribe()
    chatroomsInactivityTimersAsArray.splice(chatroomTimerIndex, 1)
    this.chatroomsInactivityTimers = new Set(chatroomsInactivityTimersAsArray)
  }*/

  startTimer(chatroomId: string): void{
    this.killTimer(chatroomId)
    const subscription = timer(this.INACTIVITY_TIMEOUT).subscribe(() => {
      this.killTimer(chatroomId)
      this.closeChat(chatroomId)
    })
    this.timers.set(chatroomId, { chatroomId, timerSubscription: subscription })
  }

  killTimer(chatroomId: string): void {
    const timer = this.timers.get(chatroomId)
    if (timer) {
      timer.timerSubscription.unsubscribe()
      this.timers.delete(chatroomId)
    }
  }

  resetTimer(chatroomId: string): void {
    /*const timer = this.timers.get(chatroomId)
    if (timer) {
      this.startTimer(chatroomId) // kill the timer if existing
    }*/
   this.startTimer(chatroomId)
  }

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