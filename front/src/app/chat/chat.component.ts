import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { IMessage } from '@stomp/stompjs';
import { IChatMessage } from '../interfaces/IChatMessage';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { QueueService } from '../services/queue.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('messageTextarea')
  messageTextarea!: ElementRef;

  chatHistory : IChatMessage[] = []
  subscribed = false

  constructor(
    private chatService : ChatService, 
    private authService : AuthService, 
    private queueService : QueueService,
    private router : Router
  ){ }

  ngOnInit(): void {
    if(this.authService.getUsername() == "") {
      this.router.navigate(['/']) 
    } 
    else {
      const displayReceivedMessageCallback = (message : IMessage) => {
        this.chatHistory.push(JSON.parse(message.body) as IChatMessage)
      }
      this.chatService.connect(displayReceivedMessageCallback)
    }
  }

  sendMessage(){
    this.chatService.send("/app/chat.sendMessage", this.messageTextarea.nativeElement.value)
    this.messageTextarea.nativeElement.value = ""
    // console.log(this.chatHistory)
  }

  refreshQueue(){
    
  }

  ngOnDestroy(): void {
      this.chatService.disconnect()
  }
}
