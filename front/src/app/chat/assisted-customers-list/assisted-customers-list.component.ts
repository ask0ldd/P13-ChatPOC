import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/IUser';
import { AssistedCustomersService } from 'src/app/services/assisted-customers.service';
import { ChatNotificationsService } from 'src/app/services/chat-notifications.service';

@Component({
  selector: 'app-assisted-customers-list',
  templateUrl: './assisted-customers-list.component.html',
  styleUrls: ['./assisted-customers-list.component.css']
})
export class AssistedCustomersListComponent implements OnDestroy, OnInit {

  @Output() callSwitchConversation = new EventEmitter<IUser>();
  @Output() callCloseConversation = new EventEmitter<IUser>();
  @Input() activeCustomer : IUser | null = null

  private assistedCustomersSubscription!: Subscription
  private chatNotificationsSubscription!: Subscription
  assistedCustomers : Array<IUser> = []
  notifications = new Set<string>()

  constructor(
    private assistedCustomersService : AssistedCustomersService,
    private chatNotificationsService : ChatNotificationsService,
  )
  { }

  ngOnInit(): void {
      this.assistedCustomersSubscription = this.assistedCustomersService.list$.subscribe(assistedCustomers => this.assistedCustomers = assistedCustomers)
      this.chatNotificationsSubscription = this.chatNotificationsService.notifications$.subscribe(notifications => this.notifications = notifications)
  }

  /**
   * Triggers the switch conversation event for a specific customer.
   * 
   * @param {IUser} customer - The customer whose conversation is to be switched.
   * @returns {void}
   */
  triggerSwitchConversation(customer : IUser){
    // console.log(JSON.stringify(this.notifications))
    this.chatNotificationsService.pullNotification(customer.chatroomName)
    this.callSwitchConversation.emit(customer)
  }

  /**
   * Triggers the close conversation event for a specific customer.
   * 
   * @param {IUser} customer - The customer whose conversation is to be closed.
   * @returns {void}
   */
  triggerCloseConversation(customer : IUser){
    const updatedAssistedCustomers = this.assistedCustomers.filter(assistedCustomer => assistedCustomer != customer)
    this.assistedCustomers = updatedAssistedCustomers
    this.activeCustomer = this.assistedCustomers.length != 0 ? this.assistedCustomers[0] : null
    // should send a message "leaved the conversation"
    if(this.activeCustomer != null) this.callSwitchConversation.emit(this.activeCustomer)
    this.callCloseConversation.emit(customer)
  }

  ngOnDestroy(): void {
    if(this.assistedCustomersSubscription) this.assistedCustomersSubscription.unsubscribe()
    if(this.chatNotificationsSubscription) this.chatNotificationsSubscription.unsubscribe()
  }
}
