import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUser } from 'src/app/interfaces/IUser';

@Component({
  selector: 'app-queue-list',
  templateUrl: './queue-list.component.html',
  styleUrls: ['./queue-list.component.css']
})
export class QueueListComponent {

  @Input() queue : IUser[] = []
  @Output() callAssignNewCustomerToAdmin = new EventEmitter<IUser>();

  /**
   * Triggers the assignment of a new customer to an admin.
   * 
   * This method emits an event with the specified customer, which can be
   * handled by the parent component to perform the necessary actions.
   * 
   * @param customer - The user object representing the new customer to be assigned.
   */
  triggerAssignNewCustomerToAdmin(customer : IUser){
    this.callAssignNewCustomerToAdmin.emit(customer)
  }
}
