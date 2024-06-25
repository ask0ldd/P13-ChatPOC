import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { IMessage } from '@stomp/stompjs';
import { IChatMessage } from '../interfaces/IChatMessage';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { QueueService } from '../services/queue.service';
import { Subscription, take } from 'rxjs';
import { IUser } from '../interfaces/IUser';
import { TUserRole } from '../types/TUserRole';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('messageTextarea')
  messageTextarea!: ElementRef;

  // !!! should be moved to chat service?
  chatHistory : IChatMessage[] = []
  queue : IUser[] = []
  queueSubscription! : Subscription

  currentRole! : TUserRole
  // activeCustomerChatroomId = ""

  assignedCustomer : IUser | null = null

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
    // console.log(JSON.stringify(message.body))
    this.chatHistory.push(JSON.parse(message.body) as IChatMessage)
  }

  sendMessage(){
    // if admin & customer selected
    if(this.currentRole == "ADMIN") {
      if(this.assignedCustomer?.chatroomId != "") this.chatService.sendMessage({isMessagePrivate : true, type : "CHAT"}, this.messageTextarea.nativeElement.value, this.assignedCustomer?.chatroomId)
    } else {
      // if customer
      this.chatService.sendMessage({isMessagePrivate : true, type : "CHAT"}, this.messageTextarea.nativeElement.value, this.authService.getLoggedUserPrivateRoomId())
    }
    this.messageTextarea.nativeElement.value = ""
  }

  refreshQueue(){
    this.queueSubscription = this.queueService.get$().pipe(take(1)).subscribe({
      next : (customers) => {
        // console.log('data : ' + JSON.stringify(data))
        this.queue = customers
      }
    })
  }

  moveToCustomerRoom(chatroomId : string){
    // this.activeCustomerChatroomId = chatroomId
    this.chatService.disconnect()
    this.chatService.connect(this.displayReceivedMessageCallback, chatroomId)
    // doesn't display?
    this.chatService.sendMessage({isMessagePrivate : true, type : "CHAT"}, "An Admin is here to help you.", chatroomId)
  }

  assignCustomer(customerName : string){
    const customer = this.queue.find(customer => customer.username == customerName)
    if(customer != null) {
      this.assignedCustomer = customer
      this.moveToCustomerRoom(this.assignedCustomer.chatroomId)
    }
  }

  ngOnDestroy(): void {
      this.chatService.disconnect()
      if(this.queueSubscription) this.queueSubscription.unsubscribe()
      this.queueService.removeSelf$().subscribe().unsubscribe()
  }
}
