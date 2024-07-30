import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/IUser';
import { AssistedCustomersService } from 'src/app/services/assisted-customers.service';

@Component({
  selector: 'app-assisted-customers-list',
  templateUrl: './assisted-customers-list.component.html',
  styleUrls: ['./assisted-customers-list.component.css']
})
export class AssistedCustomersListComponent implements OnDestroy {

  @Output() callSwitchConversation = new EventEmitter<IUser>();
  @Output() callCloseConversation = new EventEmitter<IUser>();
  @Input() activeCustomer : IUser | null = null

  private assistedCustomersSubscription!: Subscription
  assistedCustomers : Array<IUser> = []

  constructor(
    private assistedCustomersService : AssistedCustomersService,
  )
  {
    this.assistedCustomersSubscription = this.assistedCustomersService.list$.subscribe(assistedCustomers => this.assistedCustomers = assistedCustomers)
  }

  triggerSwitchConversation(customer : IUser){
    this.callSwitchConversation.emit(customer)
  }

  triggerCloseConversation(customer : IUser){
    const updatedAssistedCustomers = this.assistedCustomers.filter(assistedCustomer => assistedCustomer != customer)
    this.assistedCustomers = updatedAssistedCustomers
    this.activeCustomer = this.assistedCustomers[0]
    this.callSwitchConversation.emit(this.activeCustomer)
    this.callCloseConversation.emit(customer)
  }

  ngOnDestroy(): void {
    if(this.assistedCustomersSubscription) this.assistedCustomersSubscription.unsubscribe()
  }
}
