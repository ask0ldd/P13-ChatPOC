import { Injectable } from '@angular/core';
import { IChatMessage } from '../interfaces/IChatMessage';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { IMessage } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatSessionService {

  private activeChatroomId!: string
  private inMemoryHistory : IChatMessage[] = []
  public inMemoryHistory$ = new BehaviorSubject<IChatMessage[]>([])
  private fetchHistorySub! : Subscription

  /**
   * @constructor
   * @param {AuthService} authService - Service for authentication-related operations.
   * @param {ChatService} chatService - Service for chat-related operations.
   */
  constructor(private authService : AuthService, private chatService : ChatService) {
    this.setActiveChatroom(authService.getLoggedUserPrivateRoomId())
  }

  /**
   * @method setActiveChatroom
   * @description Sets the active chatroom and fetches its history.
   * @param {string} chatroomId - The ID of the chatroom to set as active.
   */
  setActiveChatroom(chatroomId : string){
    if(this.fetchHistorySub) this.fetchHistorySub.unsubscribe()
    this.activeChatroomId = chatroomId
    this.fetchHistorySub = this.chatService.fetchHistory$(this.activeChatroomId).pipe(take(1)).subscribe({
      next : (history) => {
        this.inMemoryHistory = history.messages
        this.inMemoryHistory$.next(this.inMemoryHistory)
      },
      error : () => this.inMemoryHistory = []
    })
  }

  /**
   * @method getActiveChatroomId
   * @description Retrieves the ID of the currently active chatroom.
   * @returns {string} The ID of the active chatroom.
   */
  getActiveChatroomId() : string{
    return this.activeChatroomId
  }

  /**
   * @method getHistory
   * @description Retrieves the current chat message history.
   * @returns {IChatMessage[]} Array of chat messages.
   */
  getHistory() : IChatMessage[] {
    return this.inMemoryHistory
  }

  /**
   * @method pushToHistory
   * @description Adds a new message to the chat history.
   * @param {IMessage} stompMessage - The message to be added to the history.
   */
  pushToHistory(stompMessage : IMessage){
    this.inMemoryHistory.push(JSON.parse(stompMessage.body) as IChatMessage)
    this.inMemoryHistory$.next(this.inMemoryHistory)
  }

  /**
   * @method setHistory
   * @description Sets the chat history to a new array of messages.
   * @param {IChatMessage[]} messages - Array of chat messages to set as the new history.
   */
  setHistory(messages : IChatMessage[]){
    this.inMemoryHistory = messages
    this.inMemoryHistory$.next(this.inMemoryHistory)
  }

  /**
   * @method fetchHistory
   * @description Fetches the chat history for the active chatroom.
   */
  fetchHistory() {
    this.chatService.fetchHistory$(this.activeChatroomId || this.authService.loggedUser.chatroomId).pipe(take(1)).subscribe({
      next : (chatRoomHistory) => {
          this.setHistory(chatRoomHistory.messages)
          this.inMemoryHistory$.next(this.inMemoryHistory)
      },
      error : () => this.setHistory([])
    })
  }
}
