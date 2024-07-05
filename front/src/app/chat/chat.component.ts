import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { IMessage } from '@stomp/stompjs';
import { IChatMessage } from '../interfaces/IChatMessage';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { QueueService } from '../services/queue.service';
import { Subscription, take, timer } from 'rxjs';
import { IUser } from '../interfaces/IUser';
import { TUserRole } from '../types/TUserRole';
import { ChatSessionService } from '../services/chat-session.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('messageTextarea')
  messageTextarea!: ElementRef;

  chatHistory : IChatMessage[] = []
  queue : IUser[] = []
  private inMemoryHistorySubscription! : Subscription
  private queueSubscription! : Subscription
  private timerSubscription!: Subscription

  currentRole! : TUserRole

  assignedCustomer : IUser | null = null // move to queue?

  constructor(
    private chatService : ChatService, 
    private authService : AuthService, 
    private queueService : QueueService,
    private chatSessionService : ChatSessionService,
    private router : Router)
  {
    this.queueSubscription = this.queueService.queue$.subscribe(queue => this.queue = queue)
    this.inMemoryHistorySubscription = this.chatSessionService.inMemoryHistory$.subscribe(history => this.chatHistory = history)
  }

  ngOnInit(): void {
    // if the user is not logged, go back to login
    if(this.authService.getLoggedUserName() == "") {
      this.router.navigate(['/']) 
    } 
    else {
      // by default, the user is connected to its own private chatroom
      this.chatService.connectToChatroom(this.displayReceivedMessageCallback, this.authService.getLoggedUserPrivateRoomId())
      this.currentRole = this.authService.getLoggedUserRole()
      // if the user is an admin, retrieve the queue and autorefresh it every x secs
      if(this.currentRole == "ADMIN") {
        this.queueService.startPolling()
      }
      // retrieve the history for the current chatroom
      this.chatSessionService.fetchHistory()
    }
  }

  // action to trigger when a new message is received
  displayReceivedMessageCallback = (message : IMessage) => {
    this.chatSessionService.pushToHistory(message)
    this.resetInactivityTimer()
  }

  sendMessage(){
    // if the user is an admin with a customer assigned, send the message to this customer's room
    if(this.currentRole == "ADMIN" && this.assignedCustomer?.chatroomId != null) {
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.assignedCustomer.chatroomId)
    } else {
      // in all the other cases, send the message to the connected user's private room
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.authService.getLoggedUserPrivateRoomId())
    }
    this.messageTextarea.nativeElement.value = ""
    this.resetInactivityTimer()
  }

  moveToAssignedCustomerRoom(chatroomId : string){
    if(this.assignedCustomer == null) return
    this.chatService.disconnect()
    this.chatSessionService.setActiveChatroom(chatroomId)
    this.chatService.connectToChatroom(this.displayReceivedMessageCallback, chatroomId)
    this.chatSessionService.fetchHistory()
  }

  assignCustomerToAdmin(customerName : string){
    // is customer still in queue
    const customer = this.queue.find(customer => customer.username == customerName)
    if(customer != null) {
      this.assignedCustomer = customer
      this.queueService.removeUser(this.assignedCustomer.username)
      this.moveToAssignedCustomerRoom(this.assignedCustomer.chatroomId)
    }
  }

  startInactivityTimer(minutes : number = 5) {
    const oneMinute = 60000
    this.timerSubscription = timer(minutes*oneMinute, minutes*oneMinute).subscribe(
      () => this.closeChat()
    )
  }

  resetInactivityTimer(minutes : number = 5) {
    if (this.timerSubscription) this.timerSubscription.unsubscribe()
    this.startInactivityTimer(minutes)
  }

  closeChat(){
    console.log("closing chat...")
  }

  ngOnDestroy(): void {
      this.chatService.disconnect()
      if(this.timerSubscription) this.timerSubscription.unsubscribe()
      if(this.queueSubscription) this.queueSubscription.unsubscribe()
      if(this.inMemoryHistorySubscription) this.inMemoryHistorySubscription.unsubscribe()
      this.queueService.removeSelf$().pipe(take(1)).subscribe().unsubscribe()
  }
}
