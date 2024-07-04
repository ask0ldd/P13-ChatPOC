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

  activeChatroomId!: string
  history : IChatMessage[] = []
  public history$ = new BehaviorSubject<IChatMessage[]>([])
  historySub! : Subscription

  constructor(private authService : AuthService, private chatService : ChatService) {
    this.setActiveChatroom(authService.getLoggedUserPrivateRoomId())
  }

  setActiveChatroom(chatroomId : string){
    if(this.historySub) this.historySub.unsubscribe()
    this.activeChatroomId = chatroomId
    this.historySub = this.chatService.fetchHistory$(this.activeChatroomId).pipe(take(1)).subscribe({
      next : (history) => {
        this.history = history.messages
        this.history$.next(this.history)
      },
      error : () => this.history = []
    })
  }

  getActiveChatroomId() : string{
    return this.activeChatroomId
  }

  getHistory() : IChatMessage[] {
    return this.history
  }

  pushToHistory(stompMessage : IMessage){
    this.history.push(JSON.parse(stompMessage.body) as IChatMessage)
    this.history$.next(this.history)
  }

  setHistory(messages : IChatMessage[]){
    this.history = messages
    this.history$.next(this.history)
  }

  fetchHistory() {
    this.chatService.fetchHistory$(this.authService.loggedUser.chatroomId).pipe(take(1)).subscribe({
      next : (chatRoomHistory) => this.setHistory(chatRoomHistory.messages),
      error : () => this.setHistory([])
    })
  }
}
