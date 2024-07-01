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
  private queueSubscription! : Subscription
  private timerSubscription!: Subscription

  currentRole! : TUserRole

  assignedCustomer : IUser | null = null

  constructor(
    private chatService : ChatService, 
    private authService : AuthService, 
    private queueService : QueueService,
    private router : Router
  ){ }

  ngOnInit(): void {
    console.log(this.authService.getLoggedUserName())
    // if the user is not logged, go back to login
    if(this.authService.getLoggedUserName() == "") {
      this.router.navigate(['/']) 
    } 
    else {
      // by default, the user is connected to its own chatroom
      this.chatService.connect(this.displayReceivedMessageCallback)
      this.currentRole = this.authService.getLoggedUserRole()
      // if the user is an admin, retrieve the queue and autorefresh it every 
      if(this.currentRole == "ADMIN") this.queueSubscription = this.queueService.getAutoRefresh$(15).subscribe({
        next : (customers) =>  this.queue = customers,
        error : () => this.queue = []
      })
      // if the user is a customer, retrieve the history of its own chatroom
      if(this.currentRole == "CUSTOMER") this.chatService.getHistory$(this.authService.loggedUser.chatroomId).pipe(take(1)).subscribe({
        next : (chatRoomHistory) => this.chatHistory = chatRoomHistory.messages,
        error : () => this.chatHistory = []
      })
    }
  }

  // action to trigger when a new message is received
  displayReceivedMessageCallback = (message : IMessage) => {
    console.log(JSON.stringify(message.body))
    this.chatHistory.push(JSON.parse(message.body) as IChatMessage)
    this.resetInactivityTimer()
  }

  sendMessage(){
    // if admin, can only send a message if a customer has been previously selected
    if(this.currentRole == "ADMIN") {
      if(this.assignedCustomer?.chatroomId != "") this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.assignedCustomer?.chatroomId)
    } else {
      // if customer, send a message to his own room
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.authService.getLoggedUserPrivateRoomId())
    }
    this.messageTextarea.nativeElement.value = ""
    this.resetInactivityTimer()
  }

  goToAssignedCustomerRoom(chatroomId : string){
    if(this.assignedCustomer == null) return
    this.chatService.disconnect()
    this.chatService.getHistory$(chatroomId).pipe(take(1)).subscribe({
      next : (chatRoomHistory) => this.chatHistory = chatRoomHistory.messages,
      error : () => this.chatHistory = []
    })
    this.chatService.connect(this.displayReceivedMessageCallback, chatroomId)
  }

  assignCustomerToAdmin(customerName : string){
    const customer = this.queue.find(customer => customer.username == customerName)
    if(customer != null) {
      this.assignedCustomer = customer
      this.queueService.removeUser$(this.assignedCustomer.username).pipe(take(1)).subscribe({
        next: (customers) => {
          this.queue = customers
        }
      }).unsubscribe()
      this.goToAssignedCustomerRoom(this.assignedCustomer.chatroomId)
    }
  }

  startInactivityTimer() {
    // 5 minute
    const oneMinute = 60000
    this.timerSubscription = timer(oneMinute*5, oneMinute*5).subscribe(
      () => this.closeChat()
    )
  }

  resetInactivityTimer() {
    if (this.timerSubscription) this.timerSubscription.unsubscribe()
    this.startInactivityTimer()
  }

  closeChat(){
    console.log("closing chat...")
  }

  ngOnDestroy(): void {
      this.chatService.disconnect()
      if(this.queueSubscription) this.queueSubscription.unsubscribe()
      if(this.timerSubscription) this.timerSubscription.unsubscribe()
      this.queueService.removeSelf$().pipe(take(1)).subscribe().unsubscribe()
  }
}
