import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { IMessage } from '@stomp/stompjs';
import { IChatMessage } from '../interfaces/IChatMessage';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { QueueService } from '../services/queue.service';
import { Subscription, take } from 'rxjs';
import { IUser } from '../interfaces/IUser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('messageTextarea')
  messageTextarea!: ElementRef;

  chatHistory : IChatMessage[] = []
  // subscribed = false
  queue : IUser[] = []
  queueSubscription! : Subscription

  currentRole! : "ADMIN" | "USER"
  activeCustomerChatroomId = ""

  constructor(
    private chatService : ChatService, 
    private authService : AuthService, 
    private queueService : QueueService,
    private router : Router
  ){ }

  ngOnInit(): void {
    if(this.authService.getLoggedUserName() == "") {
      this.router.navigate(['/']) 
    } 
    else {
      this.chatService.connect(this.displayReceivedMessageCallback)
      this.refreshQueue()
      this.currentRole = this.authService.getLoggedUserRole()
    }
  }

  // action to trigger when a new message is received
  displayReceivedMessageCallback = (message : IMessage) => {
    this.chatHistory.push(JSON.parse(message.body) as IChatMessage)
  }

  sendMessage(){
    // this.chatService.sendPublicMessage("/app/chat.sendMessage", this.messageTextarea.nativeElement.value)

    // if admin & customer selected
    if(this.currentRole == "ADMIN") {
      if(this.activeCustomerChatroomId != "") this.chatService.sendPrivateMessage(this.activeCustomerChatroomId, this.messageTextarea.nativeElement.value)
    } else {
      // if user
      this.chatService.sendPrivateMessage(this.authService.getLoggedUserPrivateRoomId(), this.messageTextarea.nativeElement.value)
    }
    this.messageTextarea.nativeElement.value = ""
  }

  refreshQueue(){
    this.queueSubscription = this.queueService.get$().pipe(take(1)).subscribe({
      next : (data) => {
        console.log('data : ' + JSON.stringify(data))
        this.queue = data
      }
    })
  }

  joinRoom(chatroomId : string){
    this.activeCustomerChatroomId = chatroomId
    this.chatService.sendPrivateMessage(chatroomId, "An Admin is here to help you.")
  }

  ngOnDestroy(): void {
      this.chatService.disconnect()
      if(this.queueSubscription) this.queueSubscription.unsubscribe()
      this.queueService.removeSelf$().subscribe().unsubscribe()
  }
}
