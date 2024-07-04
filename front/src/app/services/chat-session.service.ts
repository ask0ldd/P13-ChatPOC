import { Injectable } from '@angular/core';
import { IChatMessage } from '../interfaces/IChatMessage';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { Subscription, take } from 'rxjs';
import { IMessage } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class ChatSessionService {

  activeChatroomId!: string
  history : IChatMessage[] = []
  historySub! : Subscription

  constructor(private authService : AuthService, private chatService : ChatService) {
    this.setActiveChatroom(authService.getLoggedUserPrivateRoomId())
  }

  setActiveChatroom(chatroomId : string){
    if(this.historySub) this.historySub.unsubscribe()
    this.activeChatroomId = chatroomId
    this.historySub = this.chatService.getHistory$(this.activeChatroomId).pipe(take(1)).subscribe({
      next : (history) => this.history = history.messages,
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
  }
}
