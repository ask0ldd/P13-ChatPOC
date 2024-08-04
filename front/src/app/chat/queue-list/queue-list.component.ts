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

  triggerAssignNewCustomerToAdmin(customer : IUser){
    this.callAssignNewCustomerToAdmin.emit(customer)
  }
}
