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
import { AssistedCustomersService } from '../services/assisted-customers.service';
import { ChatNotificationsService } from '../services/chat-notifications.service';
import { AssistedCustomersListComponent } from './assisted-customers-list/assisted-customers-list.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  // @ViewChild(AssistedCustomersListComponent) assistedCustomersListComponent!: AssistedCustomersListComponent;

  @ViewChild('messageTextarea')
  messageTextarea!: ElementRef;

  queue : IUser[] = []
  private conversationSubscription! : Subscription
  private queueSubscription! : Subscription
  private timerSubscription!: Subscription

  currentRole! : TUserRole

  activeCustomer : IUser | null = null
  activeRoomName = ""
  activeConversation : IChatMessage[] = []

  constructor(
    private chatService : ChatService, 
    private authService : AuthService, 
    private queueService : QueueService,
    private assistedCustomersService : AssistedCustomersService,
    private chatNotificationsService : ChatNotificationsService,
    private router : Router)
  {
    this.queueSubscription = this.queueService.queue$.subscribe(queue => this.queue = queue)
  }

  // !!! gerer qd un admin se deco alors qu'un customer n'est pas deco, il doit pouvoir etre remis en queue automatiquement
  // pr que son pb soit solutionne par un autre admin

  ngOnInit(): void {
    // if the user is not logged, go back to login
    if(this.authService.getLoggedUserName() == "") {
      this.router.navigate(['/'])
    } 
    else {
      this.activeRoomName = this.authService.getLoggedUserPrivateRoomName()
      // by default, the user is connected to its own private chatroom
      this.chatService.initChatClient(this.receivedMessageCallback, this.activeRoomName)
      this.currentRole = this.authService.getLoggedUserRole()
      // if the user is an admin, retrieve the queue and autorefresh it every x secs
      if(this.currentRole == "ADMIN") {
        this.queueService.startPolling()
      }
      // retrieve the history for the current chatroom
      this.conversationSubscription = this.chatService.fetchHistory$(this.activeRoomName).pipe(take(1)).subscribe({
        next : (chatRoomHistory) => this.activeConversation = chatRoomHistory.messages,
        error : () => this.activeConversation = []
      })
    }
  }

  /**
   * Callback function for received messages.
   * 
   * @param {IMessage} message - The received message object.
   */
  receivedMessageCallback = (message : IMessage) => {
    const parsedMessage = JSON.parse(message.body) as IChatMessage
    const destinationRoomEndpoint = message.headers?.['destination'] ? message.headers?.['destination'] : null

    if(destinationRoomEndpoint == null || parsedMessage == null) return

    const destinationRoomName = destinationRoomEndpoint.split('/')[destinationRoomEndpoint.split('/').length-1]
    // message is displayed only if it targets the active chatroom
    if(this.activeRoomName == destinationRoomName) {
      this.activeConversation.push(parsedMessage)
      // this.resetInactivityTimer()
      return
    }

    if(this.authService.getLoggedUserRole() != "ADMIN") return
    // if the logged user is an admin receiving a message from a inactive subscribed chatrom
    this.chatNotificationsService.pushNotification(destinationRoomName)
  }

  /**
   * Sends a message to the appropriate chatroom based on the user's role and assigned customer.
   */
  sendMessage(){
    // if the user is an admin with a customer being assigned, send the message to the assigned customer's room
    if(this.currentRole == "ADMIN" && this.activeCustomer != null) {
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.activeCustomer.chatroomName)
    } else {
      // in all the other cases, send the message to the logged user's room
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.authService.getLoggedUserPrivateRoomName())
    }
    this.messageTextarea.nativeElement.value = ""
    // this.resetInactivityTimer()
  }

  /**
   * Assigns a new customer to the admin and initializes the conversation.
   * 
   * @param {IUser} customer - The customer to be assigned.
   */
  assignNewCustomerToAdmin(customer : IUser){
    if(this.queue.find(queueCustomer => JSON.stringify(queueCustomer) === JSON.stringify(customer))){
      // check if the queued user is not already assigned before reassigning him
      this.assistedCustomersService.list$.pipe(take(1)).subscribe(users => {
        const alreadyAssignedUsers = users.filter(user => JSON.stringify(user) == JSON.stringify(customer))
        if(alreadyAssignedUsers.length > 0) return
        this.assistedCustomersService.addToList(customer)
      }).unsubscribe()
      this.queueService.removeUser(customer.username)
      this.chatService.initNewConversation(this.receivedMessageCallback, customer)
      this.switchConversation(customer)
    }
  }

  /**
   * Switches the conversation to a different customer.
   * 
   * @param {IUser} customer - The customer for the new conversation.
   */
  switchConversation(customer : IUser){
    console.log("switchConvCustomer : " + JSON.stringify(customer))
    this.activeCustomer = customer
    this.activeRoomName = customer.chatroomName
    if(this.conversationSubscription) this.conversationSubscription.unsubscribe()
    console.log("roomId : " + this.activeRoomName)
    this.conversationSubscription = this.chatService.fetchHistory$(this.activeRoomName).pipe(take(1)).subscribe({
      next : (chatRoomHistory) => this.activeConversation = chatRoomHistory.messages,
      error : () => this.activeConversation = []
    })
  }

  disconnect(){
    this.assistedCustomersService.list$.pipe(take(1)).subscribe(users => users.forEach(user =>  this.closeConversation(user))).unsubscribe()
    this.ngOnDestroy()
    this.router.navigate(['/'])
  }

  /**
   * Closes the active conversation for the specified customer.
   * 
   * @param {IUser} customer - The customer whose conversation is to be closed.
   */
  closeConversation(customer : IUser){
    if(JSON.stringify(customer) != JSON.stringify(this.activeCustomer)) return
    this.chatService.closeConversation(customer)
  }

  ngOnDestroy(): void {
      this.chatService.disconnect()
      if(this.timerSubscription) this.timerSubscription.unsubscribe()
      if(this.queueSubscription) this.queueSubscription.unsubscribe()
      if(this.conversationSubscription) this.conversationSubscription.unsubscribe()
      this.queueService.removeSelf$().pipe(take(1)).subscribe().unsubscribe()
  }
}
