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
import { AssistedCustomersService } from '../services/assisted-customers.service';
import { ChatNotificationsService } from '../services/chat-notifications.service';

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
      // if the user is an admin, retrieve the customers queue and autorefresh it every 8 secs
      if(this.currentRole == "ADMIN") {
        this.queueService.startPolling()
      }
      // retrieve the history for the default active chatroom
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

    console.log('destination : ' + destinationRoomEndpoint)
    const destinationRoomName = destinationRoomEndpoint.split('/')[destinationRoomEndpoint.split('/').length-1]
    // message is displayed only if it targets the user's active chatroom
    if(this.activeRoomName == destinationRoomName) {
      this.activeConversation.push(parsedMessage)
      // this.resetInactivityTimer()
      return
    }

    if(this.authService.getLoggedUserRole() != "ADMIN") return
    // send a notification to the user if he is an admin & if he received a message in an inactive customer tab
    this.chatNotificationsService.pushNotification(destinationRoomName)
  }

  /**
   * Sends a message to the appropriate chatroom based on the user's role and assigned customer.
   * 
   * @returns {void}
   */
  sendMessage() : void {
    // if the user is an admin with a customer assigned, send the message to this customer's private room
    if(this.currentRole == "ADMIN" && this.activeCustomer != null) {
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.activeCustomer.chatroomName)
    } else {
      // in any other case, send the message to the user's own room
      this.chatService.sendMessage("CHAT", this.messageTextarea.nativeElement.value, this.authService.getLoggedUserPrivateRoomName())
    }
    this.messageTextarea.nativeElement.value = ""
    // this.resetInactivityTimer()
  }

  /**
   * Assigns a new customer to the admin and initializes the conversation.
   * 
   * @param {IUser} customer - The customer to be assigned.
   * 
   * @returns {void}
   */
  assignNewCustomerToAdmin(customer : IUser) : void{
    if(this.queue.find(queueCustomer => JSON.stringify(queueCustomer) === JSON.stringify(customer))){
      // check if the queued user is not already assigned before any assignment
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
    // console.log("switchConvCustomer : " + JSON.stringify(customer))
    this.activeCustomer = customer
    this.activeRoomName = customer.chatroomName
    if(this.conversationSubscription) this.conversationSubscription.unsubscribe()
    // console.log("roomId : " + this.activeRoomName)
    this.conversationSubscription = this.chatService.fetchHistory$(this.activeRoomName).pipe(take(1)).subscribe({
      next : (chatRoomHistory) => this.activeConversation = chatRoomHistory.messages,
      error : () => this.activeConversation = []
    })
  }

  /**
   * Disconnects the current user, closes all active conversations, and navigates to the home page.
   * 
   * @returns {void}
   */
  disconnect(): void{
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
