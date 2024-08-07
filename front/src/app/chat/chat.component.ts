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

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('messageTextarea')
  messageTextarea!: ElementRef;

  queue : IUser[] = []
  private conversationSubscription! : Subscription
  private queueSubscription! : Subscription
  private timerSubscription!: Subscription

  currentRole! : TUserRole

  activeCustomer : IUser | null = null
  activeRoomId = ""
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
      this.activeRoomId = this.authService.getLoggedUserPrivateRoomId()
      // by default, the user is connected to its own private chatroom
      this.chatService.initChatClient(this.receivedMessageCallback, this.activeRoomId)
      this.currentRole = this.authService.getLoggedUserRole()
      // if the user is an admin, retrieve the queue and autorefresh it every x secs
      if(this.currentRole == "ADMIN") {
        this.queueService.startPolling()
      }
      // retrieve the history for the current chatroom
      this.conversationSubscription = this.chatService.fetchHistory$(this.activeRoomId).pipe(take(1)).subscribe({
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

    const destinationRoomId = destinationRoomEndpoint.split('/')[destinationRoomEndpoint.split('/').length-1]
    // message is displayed only if it targets the active chatroom
    if(this.activeRoomId == destinationRoomId) {
      this.activeConversation.push(parsedMessage)
      // this.resetInactivityTimer()
      return
    }

    if(this.authService.getLoggedUserRole() != "ADMIN") return
    // if the logged user is an admin receiving a message from a inactive subscribed chatrom
    this.chatNotificationsService.pushNotification(destinationRoomId)
  }

  /**
   * Sends a message to the appropriate chatroom based on the user's role and assigned customer.
   */
  sendMessage(){
    // if the user is an admin with a customer being assigned, send the message to the assigned customer's room
    if(this.currentRole == "ADMIN" && this.activeCustomer != null) {
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.activeCustomer.chatroomId)
    } else {
      // in all the other cases, send the message to the logged user's room
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.authService.getLoggedUserPrivateRoomId())
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
      this.assistedCustomersService.addToList(customer)
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
    this.activeRoomId = customer.chatroomId
    if(this.conversationSubscription) this.conversationSubscription.unsubscribe()
    console.log("roomId : " + this.activeRoomId)
    this.conversationSubscription = this.chatService.fetchHistory$(this.activeRoomId).pipe(take(1)).subscribe({
      next : (chatRoomHistory) => this.activeConversation = chatRoomHistory.messages,
      error : () => this.activeConversation = []
    })
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
      // if(this.inMemoryHistorySubscription) this.inMemoryHistorySubscription.unsubscribe()
      if(this.conversationSubscription) this.conversationSubscription.unsubscribe()
      this.queueService.removeSelf$().pipe(take(1)).subscribe().unsubscribe()
  }
}
