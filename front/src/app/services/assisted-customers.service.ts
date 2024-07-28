import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/IUser';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistedCustomersService {

  private assistedCustomers : Array<IUser> = []
  // private activeCustomer : IUser | null = null

  constructor() { }

  get list$() : Observable<Array<IUser>>{
    return of(this.assistedCustomers)
  }

  addToList(customer : IUser){
    this.assistedCustomers.push(customer)
  }

  removeFromList(customer : IUser){
    this.assistedCustomers = this.assistedCustomers.filter(assistedCustomer => !(assistedCustomer == customer))
  }

}
