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

  /**
   * Gets an observable list of assisted customers.
   * 
   * @returns {Observable<Array<IUser>>} An observable that emits the current list of assisted customers.
   */
  get list$() : Observable<Array<IUser>>{
    return of(this.assistedCustomers)
  }

  /**
   * Adds a customer to the list of assisted customers.
   * 
   * @param {IUser} customer - The customer to be added to the list.
   */
  addToList(customer : IUser){
    this.assistedCustomers.push(customer)
  }

  /**
   * Removes a customer from the list of assisted customers.
   * 
   * @param {IUser} customer - The customer to be removed from the list.
   */
  removeFromList(customer : IUser){
    this.assistedCustomers = this.assistedCustomers.filter(assistedCustomer => !(assistedCustomer == customer))
  }

}
