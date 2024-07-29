import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/IUser';
import { AssistedCustomersService } from 'src/app/services/assisted-customers.service';
import { ChatSessionService } from 'src/app/services/chat-session.service';

@Component({
  selector: 'app-assisted-customers-list',
  templateUrl: './assisted-customers-list.component.html',
  styleUrls: ['./assisted-customers-list.component.css']
})
export class AssistedCustomersListComponent implements OnDestroy {

  @Input() switchConversation : ((customer: IUser) => void) | undefined

  private assistedCustomersSubscription!: Subscription
  assistedCustomers : Array<IUser> = []

  constructor(
    private assistedCustomersService : AssistedCustomersService,
    // private chatSessionService : ChatSessionService,
  )
  {
    this.assistedCustomersSubscription = this.assistedCustomersService.list$.subscribe(assistedCustomers => this.assistedCustomers = assistedCustomers)
  }

  /*setActiveChatroom(chatroomId : string){
    this.chatSessionService.setActiveChatroom(chatroomId) // replace
  }*/

  executeSwitchConversation(customer : IUser){
    if(this.switchConversation) this.switchConversation(customer)
  }

  ngOnDestroy(): void {
    if(this.assistedCustomersSubscription) this.assistedCustomersSubscription.unsubscribe()
  }
}
