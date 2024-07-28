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
import { AssistedCustomersService } from '../services/assisted-customers.service';
import { ChatNotificationsService } from '../services/chat-notifications.service';

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

  activeCustomer : IUser | null = null

  constructor(
    private chatService : ChatService, 
    private authService : AuthService, 
    private queueService : QueueService,
    private chatSessionService : ChatSessionService,
    private assistedCustomersService : AssistedCustomersService,
    private chatNotificationsService : ChatNotificationsService,
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
      // this.chatService.connectToChatroom(this.displayReceivedMessageCallback, this.authService.getLoggedUserPrivateRoomId())
      this.chatService.initChatClient(this.receivedMessageCallback, this.authService.getLoggedUserPrivateRoomId())
      this.currentRole = this.authService.getLoggedUserRole()
      // if the user is an admin, retrieve the queue and autorefresh it every x secs
      if(this.currentRole == "ADMIN") {
        this.queueService.startPolling()
      }
      // retrieve the history for the current chatroom
      this.chatSessionService.fetchHistory()
    }
  }

  /**
   * Callback function to handle received messages.
   * Adds the message to the chat history and resets the inactivity timer.
   * @param message - The received message object.
   */
  receivedMessageCallback = (message : IMessage) => {
    this.chatSessionService.pushToHistory(message)
    // if(this.authService.getLoggedUserRole() == "ADMIN") this.chatNotificationsService.pushNotification(this.authService.getLoggedUserPrivateRoomId())
    this.resetInactivityTimer()
  }

  /**
   * Sends a message to the appropriate chatroom based on the user's role and assigned customer.
   */
  sendMessage(){
    // if the user is an admin with a customer assigned, send the message to the assigned customer's room
    if(this.currentRole == "ADMIN" && this.activeCustomer != null) {
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.activeCustomer.chatroomId)
    } else {
      // in all the other cases, send the message to the logged user's room
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.authService.getLoggedUserPrivateRoomId())
    }
    this.messageTextarea.nativeElement.value = ""
    this.resetInactivityTimer()
  }


  /*
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
      this.assistedCustomersService.addToList(customer)
    }
  }*/

  assignCustomerToAdmin(customerName : string){
    const customer = this.queue.find(customer => customer.username == customerName)
    if(customer != null){
      this.activeCustomer = customer
      this.assistedCustomersService.addToList(customer)
      // this.assistedCustomersService.setActiveCustomer(customer)
      this.queueService.removeUser(customer.username)
      this.chatService.initNewConversation(this.receivedMessageCallback, customer)
    }
  }

  /**
   * Starts the inactivity timer.
   * @param minutes - The number of minutes before the chat is closed due to inactivity. Default is 5 minutes.
   */
  startInactivityTimer(minutes : number = 5) {
    const oneMinute = 60000
    this.timerSubscription = timer(minutes*oneMinute, minutes*oneMinute).subscribe(
      () => this.closeChat()
    )
  }

  /**
   * Resets the inactivity timer.
   * @param minutes - The number of minutes to reset the timer to. Default is 5 minutes.
   */
  resetInactivityTimer(minutes : number = 5) {
    if (this.timerSubscription) this.timerSubscription.unsubscribe()
    this.startInactivityTimer(minutes)
  }

  /**
   * Closes the chat session.
   */
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
